const { getEvensInTimeRange } = require('../models/eventModel');

function getOverlapMinutes(startDate1,endDate1,startDate2,endDate2) {
    const overlapStart = new Date(Math.max(startDate1, startDate2));
    const overlapEnd = new Date(Math.min(endDate1, endDate2));
    return Math.max(0, (overlapEnd - overlapStart) / 60000);
}

async function getOverlapEventPairs(startDate,endDate) {
    const events = await getEvensInTimeRange(startDate,endDate);
    const result = [];

    for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
            const overlapMinutes = getOverlapMinutes(events[i].start_date, events[i].end_date, events[j].start_date, events[j].end_date);
            if (overlapMinutes > 0) {
                result.push(
                    {
                    overlappingEventPairs: [
                        {
                            event_id: events[i].event_id,
                            event_name: events[i].event_name,
                            start_date: events[i].start_date,
                            end_date: events[i].end_date,
                        },
                        {
                            event_id: events[j].event_id,
                            event_name: events[j].event_name,
                            start_date: events[j].start_date,
                            end_date: events[j].end_date,
                        },
                    ],
                    overlap_duration_minutes: overlapMinutes,
                }
                );
            }
        }
    }
    return result;
}

module.exports = { getOverlapEventPairs };

    
