export interface JSCoverageRange {
   count: number;
   startOffset: number;
   endOffset: number;
}

export interface JSCoverageFunctions {
   functionName: string;
   isBlockCoverage: boolean;
   ranges: Array<JSCoverageRange>;
}

export interface JSCoverageResults {
   url: string; // Script URL.
   scriptId: string;
   source?: string; // Script content, if available.
   functions: Array<JSCoverageFunctions>;
}

export const printCodeCoverage = (results: Array<JSCoverageResults>) => {
   results.forEach((result) => {
      result.functions.forEach((fnResult) => {
         // Skipping functions we didn't write.
         if (fnResult.functionName.indexOf("./") === -1 || fnResult.functionName.indexOf("modules") !== -1 || fnResult.functionName.indexOf("node_modules") !== -1) {
            return;
         }

         console.log(`Function ${fnResult.functionName} has coverage:`)

         fnResult.ranges.forEach((range) => {
            if (range.count === 0) {
               return;
            }

            console.log(`\tFrom line ${range.startOffset} to ${range.endOffset} for a total count of ${range.count} line(s).`);
         });
      });
   });
}

export const getMockUserCreds = (): [string, string] => {
   return [
      'abbasr723868@gmail.com',
      'Jul17200123%'
   ]
}