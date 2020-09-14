This is a minimal reproduction case for https://bugs.chromium.org/p/chromium/issues/detail?id=1127392
Steps:
1. Install [extension](/extension)
2. Open extension's background script debug panel (we gonna use that to inspect coverage report)
3. Open [index.html](/index.html) page
4. Launch extension and click "Start coverage collection"
5. On [index.html](/index.html) press "Trigger sample function" button
6. In extension popup click "Stop coverage collection" (make sure devtools panel for extension's background script is open!)
7. Devtools should pause on "debugger;" statement. See contents of `data` variable to see collected coverage
  It must contain 2 elements, first one nesting `sample` function coverage, with the following properties:
  ```
  functions: Array(1)
    0:
      functionName: "sample"
      isBlockCoverage: true
      ranges: Array(3)
        0: {count: 1, endOffset: 390, startOffset: 28}
        1: {count: 0, endOffset: 237, startOffset: 183}
        2: {count: 0, endOffset: 357, startOffset: 245}
        length: 3
  ```
  Range [0] "covers" the whole function with execution count of one
  While ranges [1] and [2] "exclude" not-covered lines from that range
  At that point, everything is correct

8. **Without reloading the page** perform steps from 4 to 7 and check `data` variable again

It *must* contain coverage for **second** case from switch statement.

But instead, it holds single range for the whole function:
```
functions: Array(1)
  0:
    functionName: "sample"
    isBlockCoverage: false
    ranges: Array(1)
      0: {count: 1, endOffset: 390, startOffset: 28}
      length: 1
```
**NOTE**: It appears if you perform step 8 **after you open other tab** and **wait** *long enough* (like around 5-10 minutes) coverage is going to be correct (containing multiple ranges, covering switch case 2 with correct execution counts)

**P.S.** All steps described above are performed without any target page ( [index.html](/index.html) ) reloads whatsoever