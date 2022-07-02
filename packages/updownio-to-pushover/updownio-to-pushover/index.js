const Push   = require("pushover-notifications");
const moment = require("moment-timezone");


function errorCodes(err) {
    switch (err) {
        case "Errno::ECONNREFUSED":
            return "Connection Refused";
        case "Errno::ETIMEDOUT":
            return "Connection Timeout";
        case "Errno::EHOSTUNREACH":
            return "Host Unreachable";
        default:
            return err;
    }
}

// no async for Push...
exports.main = (args) => {
    let response = {
        statusCode: 200,
        body: "done"
    };

    if (args.__ow_headers["user-agent"] !== "updown.io webhooks") {
        response = {
            statusCode: 422
        };
        return response;
    }

    const p = new Push({
        user: process.env.PUSHOVER_USER, token: process.env.PUSHOVER_TOKEN
    });

    let body = args.__ow_body[0];

    let msg_message, timestr, updownEvent;
    if (body.event === "check.down") {
        updownEvent = "DOWN";
        timestr     = moment(body.downtime.started_at).tz("Europe/Amsterdam").format("HH:mm:ss z");
        msg_message = "Down since: " + timestr + "\nReason: " + errorCodes(body.downtime.error);
    } else if (body.event === "check.up") {
        updownEvent = "UP";
        timestr     = moment(body.downtime.ended_at).tz("Europe/Amsterdam").format("HH:mm:ss z");
        msg_message = "Up since: " + timestr + ", after " + (Math.round((body.downtime.duration / 60) * 10) / 10) + " minutes of downtime\nReason: " + errorCodes(body.downtime.error);
    } else {
        response = {
            statusCode: 422
        };
        return response;
    }

    const msg = {
        message: msg_message, title: updownEvent + ": " + (body.check.alias ? body.check.alias : body.check.url),
    };

    p.send(msg, (err, res) => {
        if (err) {
            throw err;
        }

        response = {
            statusCode: 200, body: null
        };
        return response;
    });

    response = {
        statusCode: 500,
        body: "notifications not send"
    };
    return response;
}
