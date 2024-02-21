function uuidGenerator() {
  return `${new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replaceAll("T", "")
    .replaceAll("Z", "")}`;
}

// module.exports = uuidGenerator;

function dateFormator() {
  let date = new Date(
    Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
    })
  );
  return `${date.getFullYear()}-${date
    .getMonth()
    .toString()
    .padStart(2, "0")}-${date.getDay().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${date.getMilliseconds()}`;
}

module.exports = { dateFormator, uuidGenerator };
