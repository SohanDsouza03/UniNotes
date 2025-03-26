// lib/code-samples.ts
export const CODE_SAMPLES: Record<string, string> = {
  c: `#include <stdio.h>
  
  int main() {
      printf("Hello, UniNotes!\\n");
      return 0;
  }`,
  cpp: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, UniNotes!" << endl;
      return 0;
  }`,
  python: `print("Hello, UniNotes!")`,
  java: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, UniNotes!");
      }
  }`,
  javascript: `console.log("Hello, UniNotes!");`,
};
