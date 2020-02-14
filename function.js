const request = require("request");

module.exports = {
  twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
  },

  setTimeout_(fn, delay) {
    var maxDelay = Math.pow(2, 31) - 1;

    if (delay > maxDelay) {
      var args = arguments;
      args[1] -= maxDelay;

      return setTimeout(function() {
        this.setTimeout_.apply(fn, args);
      }, maxDelay);
    }

    return setTimeout.apply(fn, arguments);
  },
  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  },
  validYTURL(str) {
    var pattern = new RegExp(
      "^(http(s)?://)?((w){3}.)?youtu(be|.be)?(.com)?/.+"
    ); // fragment locator
    return !!pattern.test(str);
  },
  decodeHtmlEntity(str) {
    return str
      .replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      })
      .replace(/&quot;/g, `"`)
      .replace(/&amp;/g, `&`);
  },

  encodeHtmlEntity(str) {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }
    return buf.join("");
  },

  search(options, callback) {
    var url =
      "http://api.serpstack.com/search?access_key=" +
      options.key +
      "&query=" +
      options.qs.q;
    request(
      {
        url: url,
        json: true
      },
      function(error, response, body) {
        callback(error, body);
      }
    );
  },
  shuffleArray(array) {
    let temp = array[0];
    array.splice(0, 1);
    var i;
    var j;
    var x;
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    array.unshift(temp);
    temp = [];
    return array;
  },
  findUser(message, str) {
    if(isNaN(parseInt(str))) {
      if (!str.startsWith("<@")) {
        message.channel.send(
          "**" + str + "** is neither a mention or ID."
        );
        return;
      }
    }

    const userID = str
      .replace(/<@/g, "")
      .replace(/!/g, "")
      .replace(/>/g, "");

    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions

    return message.channel.client.users.fetch(userID)
  },
  findMember(message, str) {
    if(isNaN(parseInt(str))) {
      if (!str.startsWith("<@")) {
        message.channel.send(
          "**" + str + "** is neither a mention or ID."
        );
        return;
      }
    }

    const userID = str
      .replace(/<@/g, "")
      .replace(/!/g, "")
      .replace(/>/g, "");

    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions

    return message.guild.members.fetch(userID)
  },
  getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
  },
  applyText(canvas, text) {
                const ctx = canvas.getContext("2d");

                //calculate largest font size
                let fontSize = canvas.width / 12;

                //reduce font size loop
                do {
                  //reduce font size
                  ctx.font = `${(fontSize -= 5)}px sans-serif`;
                  // Compare pixel width of the text to the canvas minus the approximate avatar size
                } while (
                  ctx.measureText(text).width >
                  canvas.width - 100
                );

                // Return the result to use in the actual canvas
                return ctx.font;
              }
};
