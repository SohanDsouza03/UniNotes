"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { PlanSelector } from "./components/PlanSelector";
import { Header } from "./components/Header";
import BlurFade from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Popup } from "./components/Popup";
import { Input } from "@/components/ui/input";
import { BillSummaryPopup } from "./components/BillSummaryPopup";
import { triggerConfetti } from "./utils/triggerConfetti";
import { posts } from "#site/content";

export default function BuyPremiumPage() {
  const { data: session, status } = useSession();
  const [tier, setTier] = useState<keyof typeof tierPricing>("Tier 1");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPreview, setDiscountPreview] = useState<{
    originalPrice: number;
    finalPrice: number;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  const [showBillSummary, setShowBillSummary] = useState(false);

  const tierPricing = { "Tier 1": 62, "Tier 2": 134, "Tier 3": 174 };

  const universities = useMemo(() => {
    return Array.from(
      new Set(
        posts
          .map((post) => post.metadata?.university)
          .filter((u): u is string => !!u)
      )
    );
  }, []);

  const degrees = useMemo(() => {
    return university
      ? Array.from(
          new Set(
            posts
              .filter((post) => post.metadata?.university === university)
              .map((post) => post.metadata?.degree)
              .filter((d): d is string => !!d)
          )
        )
      : [];
  }, [university]);

  const semesters = useMemo(() => {
    if (!university || !degree) return [];
    const semesterSet = new Set(
      posts
        .filter(
          (post) =>
            post.metadata?.university === university &&
            post.metadata?.degree === degree
        )
        .map((post) => post.metadata?.semester)
        .filter((s): s is string => !!s)
    );
    const semesterArray = Array.from(semesterSet);
    return semesterArray.sort((a, b) => {
      const getNumber = (s: string) => {
        const match = s.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getNumber(a) - getNumber(b);
    });
  }, [university, degree]);

  const yearOptions =
    degree === "B Tech"
      ? ["1st Year", "2nd Year", "3rd Year"]
      : degree === "B Tech CSBS"
      ? ["2nd Year"]
      : [];

  const semesterOptions = semesters;

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      setPhoneNumber(session.user.phoneNumber || null);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);

  useEffect(() => {
    setYear("");
    setSemester("");
  }, [degree]);

  useEffect(() => {
    setSemester("");
  }, [year]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon/referral code.");
      setDiscountPreview(null);
      return;
    }
    try {
      const response = await fetch("/api/coupons/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          basePrice: tierPricing[tier],
          couponCode: couponCode.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setCouponError(data.error || "Invalid coupon/referral code");
        setDiscountPreview(null);
      } else {
        setCouponError("");
        setDiscountPreview(data);
        triggerConfetti();
        if (
          data.message &&
          data.message.toLowerCase().includes("referral code applied")
        ) {
          const redeemRes = await fetch("/api/refer/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              couponCode: couponCode.trim().toUpperCase(),
            }),
          });
          const redeemData = await redeemRes.json();
          if (!redeemRes.ok) {
            if (
              !redeemData.error ||
              !redeemData.error.toLowerCase().includes("already redeemed")
            ) {
              setCouponError(
                redeemData.error || "Failed to record referral redemption"
              );
            }
          }
        }
      }
    } catch (error) {
      setCouponError("Failed to apply coupon/referral code");
      setDiscountPreview(null);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setPopupMessage("Please log in first!");
      setShowPopup(true);
      return;
    }

    if (!university || !degree || !year || !semester || !tier) {
      setPopupMessage("Please select all required fields");
      setShowPopup(true);
      return;
    }

    if (!phoneNumber) {
      setShowPhonePrompt(true);
      return;
    }

    setShowBillSummary(true);
  };

  const handleConfirmPayment = () => {
    setShowBillSummary(false);
    initiatePayment();
  };

  const handleCancelBillSummary = () => {
    setShowBillSummary(false);
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          university,
          degree,
          year,
          semester,
          amount: tierPricing[tier],
          couponCode: couponCode.trim() ? couponCode.trim() : undefined,
        }),
      });

      const order = await response.json();

      if (!order.id) {
        setPopupMessage(
          "Failed to create Razorpay order: " + (order.error || "")
        );
        setShowPopup(true);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "UniNotes Premium",
        description: `Subscription for ${tier} (${year} - ${semester})`,
        order_id: order.id,
        handler: async (razorpayResponse: any) => {
          const verification = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...razorpayResponse,
              userId: user.id,
              tier,
              university,
              degree,
              year,
              semester,
              amount: order.amount,
              couponCode: couponCode.trim() ? couponCode.trim() : undefined,
            }),
          });
          const result = await verification.json();
          if (result.success) {
            triggerConfetti();
            setPopupMessage(
              "Payment successful now you should re-login to see the changes!"
            );
          } else {
            setPopupMessage(
              "Payment verification failed: " + (result.error || "")
            );
          }
          setShowPopup(true);
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#cc7d28" },
      };

      if (typeof window !== "undefined") {
        const Razorpay = await loadRazorpayScript();
        if (Razorpay) {
          const razorpay = new (Razorpay as any)(options);
          razorpay.open();
        } else {
          setPopupMessage("Failed to load Razorpay script");
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setPopupMessage("An error occurred during checkout");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve((window as any).Razorpay);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  };

  const handlePhoneSubmit = async () => {
    const cleanedNumber = (phoneNumber || "").replace(/\D/g, "");

    if (!cleanedNumber || cleanedNumber.length < 10) {
      setPopupMessage("Please enter a valid phone number");
      setShowPopup(true);
      return;
    }

    if (/^(\d)\1+$/.test(cleanedNumber)) {
      setPopupMessage("Please enter a valid phone number");
      setShowPopup(true);
      return;
    }

    const isSequential = (number: string | any[]) => {
      let isAscending = true;
      let isDescending = true;

      for (let i = 1; i < number.length; i++) {
        const current = parseInt(number[i], 10);
        const previous = parseInt(number[i - 1], 10);

        if (current !== previous + 1) isAscending = false;
        if (current !== previous - 1) isDescending = false;
        if (!isAscending && !isDescending) break;
      }

      return isAscending || isDescending;
    };

    if (isSequential(cleanedNumber)) {
      setPopupMessage("Please enter a valid phone number");
      setShowPopup(true);
      return;
    }
    try {
      await fetch("/api/save-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          phoneNumber: cleanedNumber,
        }),
      });
      setShowPhonePrompt(false);
      setShowBillSummary(true);
    } catch (error) {
      setPopupMessage("Failed to save phone number");
      setShowPopup(true);
    }
  };

  return (
    <div className="relative">
      <div
        className={`p-8 h-screen mx-auto rounded-xl space-y-4 flex flex-col items-center justify-center font-wotfard ${
          showPopup ? "blur-md" : ""
        }`}
      >
        <Header isAuthenticated={!!user} userName={session?.user.name || ""} />
        <div className="max-w-md w-full space-y-4">
          <PlanSelector
            label="University"
            options={universities}
            selectedOption={university}
            onSelect={setUniversity}
          />
          <PlanSelector
            label="Degree"
            options={degrees}
            selectedOption={degree}
            onSelect={setDegree}
          />
          {degree && (
            <PlanSelector
              label="Year"
              options={yearOptions}
              selectedOption={year}
              onSelect={setYear}
            />
          )}
          {year && (
            <PlanSelector
              label="Semester"
              options={semesterOptions}
              selectedOption={semester}
              onSelect={setSemester}
            />
          )}
          <PlanSelector
            label="Plan Tier"
            options={["Tier 1", "Tier 2", "Tier 3"]}
            selectedOption={tier}
            onSelect={(value) => setTier(value as keyof typeof tierPricing)}
          />

          <BlurFade delay={0.4} inView>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Coupon / Referral Code (Optional)
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyCoupon();
                    }
                  }}
                  onBlur={handleApplyCoupon}
                  placeholder="Enter coupon or referral code"
                  className="transition-all duration-300 uppercase"
                />
                <Button variant="secondary" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm">{couponError}</p>
              )}
              {discountPreview && (
                <p className="text-green-600 text-sm">
                  {discountPreview.message}: You save ₹
                  {discountPreview.discountAmount.toFixed(2)}
                </p>
              )}
            </div>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <Button
              variant={"default"}
              className="w-full py-2 px-4 font-bold rounded-md shadow-md font-wotfard tracking-widest"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : discountPreview ? (
                <div className="flex flex-col items-center">
                  <span className="text-sm">
                    Proceed to pay{" "}
                    <span className="line-through text-red-500 mr-1">
                      ₹{tierPricing[tier]}
                    </span>{" "}
                    ₹{discountPreview.finalPrice} + Tax
                  </span>
                </div>
              ) : (
                `Proceed to Pay ₹${tierPricing[tier]} + Tax*`
              )}
            </Button>
          </BlurFade>
        </div>
      </div>

      {showPhonePrompt && (
        <Popup
          message={
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Enter your phone number
              </label>
              <input
                type="text"
                value={phoneNumber || ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePhoneSubmit();
                  }
                }}
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
              <Button
                variant={"default"}
                className="w-full py-2"
                onClick={handlePhoneSubmit}
              >
                Submit
              </Button>
            </div>
          }
          onClose={() => setShowPhonePrompt(false)}
        />
      )}

      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          showLoginButton={popupMessage === "Please log in first!"}
        />
      )}

      {showBillSummary && (
        <BillSummaryPopup
          originalPrice={tierPricing[tier]}
          finalPrice={
            discountPreview ? discountPreview.finalPrice : tierPricing[tier]
          }
          discountAmount={discountPreview ? discountPreview.discountAmount : 0}
          onConfirm={handleConfirmPayment}
          onClose={handleCancelBillSummary}
        />
      )}
    </div>
  );
}
