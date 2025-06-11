# Performance Report

**Generated:** 2025-06-05T12:31:09.742Z

## 📦 Bundle Analysis

| Metric | Size | Status |
|--------|------|--------|
| Total Bundle | 3.88 MB | ❌ |
| JavaScript | 2.32 MB | ❌ |
| CSS | 119.61 KB | ✅ |
| Largest Chunk | 916.72 KB | ⚠️ |

## ⚠️ Alerts

- ❌ **bundle**: Total bundle size (3.88 MB) exceeds limit (2 MB)
- ❌ **bundle**: JS bundle size (2.32 MB) exceeds limit (1.5 MB)
- ⚠️ **bundle**: Largest chunk (916.72 KB) exceeds recommended size (800 KB)
- ❌ **lighthouse**: Lighthouse audit failed: Command failed: npx lhci autorun --config=lighthouserc.js
Checking assertions against 3 URL(s), 9 total run(s)

8 result(s) for [1mhttp://localhost:3000/[0m :

  [31m×[0m  [1mcategories[0m.performance failure for [1mminScore[0m assertion
        expected: >=[32m0.85[0m
           found: [31m0.55[0m
      [2mall values: 0.55, 0.54, 0.55[0m


  [31m×[0m  [1mfirst-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       First Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/

        expected: <=[32m2000[0m
           found: [31m13914.677375000003[0m
      [2mall values: 13914.677375000003, 13930.343400000002, 13923.72155[0m


  [31m×[0m  [1mlargest-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       Largest Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/

        expected: <=[32m3000[0m
           found: [31m26767.917850000013[0m
      [2mall values: 26767.917850000013, 26951.159199999995, 26884.2711[0m


  [31m×[0m  [1mspeed-index[0m failure for [1mmaxNumericValue[0m assertion
       Speed Index
       https://developer.chrome.com/docs/lighthouse/performance/speed-index/

        expected: <=[32m3000[0m
           found: [31m13914.677375000003[0m
      [2mall values: 13914.677375000003, 13930.343400000002, 13923.72155[0m


  [31m×[0m  [1munminified-javascript[0m failure for [1mminScore[0m assertion
       Minify JavaScript
       https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  [31m×[0m  [1muses-text-compression[0m failure for [1mminScore[0m assertion
       Enable text compression
       https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-rel-preload[0m warning for [1mauditRan[0m assertion
       "uses-rel-preload" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-webp-images[0m warning for [1mauditRan[0m assertion
       "uses-webp-images" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m

8 result(s) for [1mhttp://localhost:3000/transactions[0m :

  [31m×[0m  [1mcategories[0m.performance failure for [1mminScore[0m assertion
        expected: >=[32m0.85[0m
           found: [31m0.55[0m
      [2mall values: 0.55, 0.55, 0.55[0m


  [31m×[0m  [1mfirst-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       First Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/

        expected: <=[32m2000[0m
           found: [31m13844.329275000002[0m
      [2mall values: 13844.329275000002, 13942.249800000003, 13915.917600000008[0m


  [31m×[0m  [1mlargest-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       Largest Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/

        expected: <=[32m3000[0m
           found: [31m26784.810899999997[0m
      [2mall values: 26784.810899999997, 26817.488800000003, 26919.805500000006[0m


  [31m×[0m  [1mspeed-index[0m failure for [1mmaxNumericValue[0m assertion
       Speed Index
       https://developer.chrome.com/docs/lighthouse/performance/speed-index/

        expected: <=[32m3000[0m
           found: [31m13844.329275000002[0m
      [2mall values: 13844.329275000002, 13942.249800000003, 13915.917600000008[0m


  [31m×[0m  [1munminified-javascript[0m failure for [1mminScore[0m assertion
       Minify JavaScript
       https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  [31m×[0m  [1muses-text-compression[0m failure for [1mminScore[0m assertion
       Enable text compression
       https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-rel-preload[0m warning for [1mauditRan[0m assertion
       "uses-rel-preload" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-webp-images[0m warning for [1mauditRan[0m assertion
       "uses-webp-images" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m

8 result(s) for [1mhttp://localhost:3000/options[0m :

  [31m×[0m  [1mcategories[0m.performance failure for [1mminScore[0m assertion
        expected: >=[32m0.85[0m
           found: [31m0.55[0m
      [2mall values: 0.55, 0.55, 0.55[0m


  [31m×[0m  [1mfirst-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       First Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/

        expected: <=[32m2000[0m
           found: [31m13844.475999999999[0m
      [2mall values: 13844.475999999999, 13917.770250000001, 13919.693[0m


  [31m×[0m  [1mlargest-contentful-paint[0m failure for [1mmaxNumericValue[0m assertion
       Largest Contentful Paint
       https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/

        expected: <=[32m3000[0m
           found: [31m26777.390499999998[0m
      [2mall values: 26951, 26927.442, 26777.390499999998[0m


  [31m×[0m  [1mspeed-index[0m failure for [1mmaxNumericValue[0m assertion
       Speed Index
       https://developer.chrome.com/docs/lighthouse/performance/speed-index/

        expected: <=[32m3000[0m
           found: [31m13844.475999999999[0m
      [2mall values: 13844.475999999999, 13917.770250000001, 13919.693[0m


  [31m×[0m  [1munminified-javascript[0m failure for [1mminScore[0m assertion
       Minify JavaScript
       https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  [31m×[0m  [1muses-text-compression[0m failure for [1mminScore[0m assertion
       Enable text compression
       https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/

        expected: >=[32m0.9[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-rel-preload[0m warning for [1mauditRan[0m assertion
       "uses-rel-preload" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m


  ⚠️  [1muses-webp-images[0m warning for [1mauditRan[0m assertion
       "uses-webp-images" is not a known audit.

        expected: >=[32m1[0m
           found: [31m0[0m
      [2mall values: 0, 0, 0[0m

Assertion failed. Exiting with status code 1.
assert command failed. Exiting with status code 1.

