const { getEventById,getChildrenEvents } = require('../models/eventModel');

async function getTimeline(event_id) {

    const rootEvent = await getEventById(event_id);

    const children = await getChildrenEvents(event_id);

    rootEvent.children = [];

    for (const child of children) {
        const childData = await getTimeline(child.event_id);
        rootEvent.children.push(childData);
    }
    return rootEvent;
}

module.exports = { getTimeline };
