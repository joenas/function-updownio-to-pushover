const Pushover = require("pushover-js").Pushover;
const moment = require("moment-timezone");

const updown_down_event = "check.down";
const updown_up_event = "check.up";
const updown_events = [updown_down_event, updown_up_event];

const updown_ssl_invalid = "check.ssl_invalid";
const updown_ssl_valid = "check.ssl_valid";
const updown_ssl_expiration = "check.ssl_expiration";
const updown_ssl_renewed = "check.ssl_renewed";
const ssl_events = [updown_ssl_invalid, updown_ssl_valid, updown_ssl_expiration, updown_ssl_renewed];

const updown_performance_drop = "check.performance_drop";
const performance_events = [updown_performance_drop];

const valid_events = [...updown_events, ...ssl_events, ...performance_events];

exports.main = async (args) => {
    let response;

    if (args.__ow_headers["user-agent"] !== "updown.io webhooks") {
        response = {
            statusCode: 422, body: null
        };
        console.log("user-agent(" + args.__ow_headers["user-agent"] + ") was not \"updown.io webhooks\"");
        return response;
    }

    const pushover = new Pushover(process.env.PUSHOVER_USER, process.env.PUSHOVER_TOKEN);

    let body = args.__ow_body[0];
    if (body.event === undefined || !valid_events.includes(body.event)) {
        response = {
            statusCode: 422, body: null
        };
        console.log("event was unknown to code: " + body.event);
        return response;
    }

    let updownEvent, eventTime;
    let pushoverMessage = body.check.description;
    if (body.event === updown_down_event) {
        updownEvent = "🔴 Down";
        eventTime = moment(body.downtime.started_at);
    } else if (body.event === updown_up_event) {
        updownEvent = "✅ Up";
        eventTime = moment(body.downtime.ended_at);
    } else if (body.event in ssl_events) {
        updownEvent = "🔐 SSL";
        eventTime = moment(body.check.last_check_at);
    } else if (body.event in performance_events) {
        updownEvent = "⚡ Performance";
        eventTime = moment(body.check.last_check_at);
    } else {
        updownEvent = "❓ Unknown";
        eventTime = moment(body.check.last_check_at);
        pushoverMessage = "Unknown event: " + body.event;
    }

    const msg = {
        message: pushoverMessage, title: updownEvent + ": " + (body.check.alias ? body.check.alias : body.check.url), timestamp: eventTime.unix()
    };

    return await pushover
        .setTimestamp(msg.timestamp)
        .send(msg.title, msg.message)
        .then(response => {
            console.log("Event forwarded to Pushover!");
            console.log(msg);

            response = {
                statusCode: 200, body: null
            };
            return response;
        })
        .catch(err => {
            console.log("Failed to forward event to Pushover...");
            console.log(msg);
            console.log(err);

            // Send not code 200 back to updown.io, will try again up to 25 times
            response = {
                statusCode: 500, body: "notifications not send"
            };
            return response;
        });
};
