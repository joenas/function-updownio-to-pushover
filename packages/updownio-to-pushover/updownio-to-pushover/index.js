const Push   = require("pushover-notifications");
const moment = require("moment-timezone");

const updown_down_event = "check.down";
const updown_up_event   = "check.up";
const valid_events      = [
    updown_down_event,
    updown_up_event
];

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
    let response;

    if (args.__ow_headers["user-agent"] !== "updown.io webhooks") {
        response = {
            statusCode: 422,
            body: null
        };
        console.log("user-agent(" + args.__ow_headers["user-agent"] + ") was not \"updown.io webhooks\"");
        return response;
    }

    const p = new Push({
        user: process.env.PUSHOVER_USER,
        token: process.env.PUSHOVER_TOKEN
    });

    let body = args.__ow_body[0];
    if (body.event === undefined || !valid_events.includes(body.event)) {
        response = {
            statusCode: 422,
            body: null
        };
        console.log("event was unknown to code: " + body.event);
        return response;
    }

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
        console.log("event was unknown to code: " + body.event);
        return response;
    }

    const msg = {
        message: msg_message,
        title: updownEvent + ": " + (body.check.alias ? body.check.alias : body.check.url),
    };

    p.send(msg, (err, data, res) => {
        if (err) {
            response = {
                statusCode: 500,
                body: "notifications not send"
            };
            console.log("Failed to forward event to Pushover...");
            throw err;
        }

        response = {
            statusCode: 200, body: null
        };
        console.log("Event forwarded to Pushover!");
        console.log(msg);
        return response;
    })
}
