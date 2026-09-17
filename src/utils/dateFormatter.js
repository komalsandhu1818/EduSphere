export const formattedDate = (date) => {
  if(date)
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  else
    return null;
  }