const Pushover = require( 'pushover-js').Pushover;
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

exports.main = async (args) => {
    let response;

    if (args.__ow_headers["user-agent"] !== "updown.io webhooks") {
        response = {
            statusCode: 422,
            body: null
        };
        console.log("user-agent(" + args.__ow_headers["user-agent"] + ") was not \"updown.io webhooks\"");
        return response;
    }

    const pushover = new Pushover(process.env.PUSHOVER_USER, process.env.PUSHOVER_TOKEN);

    let body = args.__ow_body[0];
    if (body.event === undefined || !valid_events.includes(body.event)) {
        response = {
            statusCode: 422,
            body: null
        };
        console.log("event was unknown to code: " + body.event);
        return response;
    }

    let pushoverMessage, timestr, updownEvent, eventTime;
    if (body.event === "check.down") {
        updownEvent     = "🔴 Down";
        eventTime       = moment(body.downtime.started_at);
        timestr         = eventTime.tz("Europe/Amsterdam").format("HH:mm:ss z");
        pushoverMessage = "Down since: " + timestr + "\nReason: " + errorCodes(body.downtime.error);
    } else if (body.event === "check.up") {
        updownEvent     = "✅ Up";
        eventTime       = moment(body.downtime.ended_at);
        timestr         = eventTime.tz("Europe/Amsterdam").format("HH:mm:ss z");
        pushoverMessage = "Up since: " + timestr + ", after " + (Math.round((body.downtime.duration / 60) * 10) / 10) + " minutes of downtime\nReason: " + errorCodes(body.downtime.error);
    }

    const msg = {
        message: pushoverMessage,
        title: updownEvent + ": " + (body.check.alias ? body.check.alias : body.check.url),
        timestamp: eventTime.unix()
    };

    return await pushover
        .setTimestamp(msg.timestamp)
        .send(msg.title, msg.message)
        .then(response => {
            console.log("Event forwarded to Pushover!");
            console.log(msg);

            response = {
                statusCode: 200,
                body: null
            };
            return response;
        })
        .catch(err => {
            console.log("Failed to forward event to Pushover...");
            console.log(msg);
            console.log(err);

            // Send not code 200 back to updown.io, will try again up to 25 times
            response = {
                statusCode: 500,
                body: 'notifications not send'
            };
            return response;
        })
};
