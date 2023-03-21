export const getRelativeTimeText = (current: number, previous: number): string => {
   const msPerMinute = 60 * 1000;
   const msPerHour = msPerMinute * 60;
   const msPerDay = msPerHour * 24;
   const msPerMonth = msPerDay * 30;
   const msPerYear = msPerDay * 365;

   const elapsed = current - previous;

   if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
   }

   else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
   }

   else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
   }

   else if (elapsed < msPerMonth) {
      return "~" + Math.round(elapsed / msPerDay) + " days ago";
   }

   else if (elapsed < msPerYear) {
      return "~" + Math.round(elapsed / msPerMonth) + " months ago";
   }

   else {
      return "~" + Math.round(elapsed / msPerYear) + " years ago";
   }
}

export const getFormattedDateString = (date: Date): string => {
   const year = date.getFullYear();
   const day = date.getDay();
   const month = date.getMonth();

   return `${day}/${month}/${year}`;
}

export const formatCurrencyToString = (amount: number): string => {
   const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      compactDisplay: "short",
   });

   const formattedString = formatter.format(amount);

   // Removing empty cents.
   return formattedString.replace(".00", "");
}
