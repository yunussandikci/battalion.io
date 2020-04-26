
const EventType = {
    PLAYER_DIE: "PLAYER_DIE",
};

class Event {

}

class EventManager {
    constructor() {
        this.events = {}
    }

    clearEvents() {
        this.events = {}
    }

    getEvents() {
        const currentEvents = this.events;
        this.clearEvents();
        return currentEvents
    }
}

module.exports.EventManager = EventManager