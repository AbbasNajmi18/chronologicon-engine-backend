const { getEvensInTimeRange,getSortEventsByStartDate,getEventById,getChildrenEvents } = require('../models/eventModel');

function getOverlapMinutes(startDate1,endDate1,startDate2,endDate2) {
    const overlapStart = new Date(Math.max(startDate1, startDate2));
    const overlapEnd = new Date(Math.min(endDate1, endDate2));
    return Math.max(0, (overlapEnd - overlapStart) / 60000);
}

function getDurationMinutes(startDate,endDate) {
    return Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60));
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

function calculateGapMinutes(date1, date2) {
    return Math.floor((new Date(date2) - new Date(date1)) / (1000 * 60));
}

async function findLargestTemporalGap(startDate,end_date) {
    const events = await getSortEventsByStartDate(startDate,end_date);

    if (events.length < 2) {
        return {largestGap: null, message: "No significant temporal gaps found within the specified range, or too few events."};
    }
    let maxGap = 0;
    let maxGapEvents = null;
    for (let i = 0; i < events.length - 1; i++) {
        const gapMinutes = calculateGapMinutes(events[i].end_date, events[i + 1].start_date);
        if (gapMinutes > maxGap) {
            maxGap = gapMinutes;
           maxGapEvents = {
            startOfGap: events[i].end_date,
            endOfGap: events[i + 1].start_date,
            durationMinutes: gapMinutes,
            precedingEvent:{
                event_id: events[i].event_id,
                event_name: events[i].event_name,
                end_date: events[i].end_date,
            },
            succeedingEvent:{
                event_id: events[i + 1].event_id,
                event_name: events[i + 1].event_name,
                start_date: events[i + 1].start_date,
            }
           }
        }
    }
    if(maxGapEvents){
        return { largestGap:maxGapEvents, message: "Largest temporal gap identified." };
    }
    return { largestGap:null, message: "No significant temporal gaps found within the specified range, or too few events." };
}

async function findShortestInfluencePath(sourceEventId, targetEventId) {
    const visited = new Set();
    const queue = [];
  
    const sourceEvent = await getEventById(sourceEventId);
    if (!sourceEvent) {
      return { message: 'Source event not found.' };
    }
  
    queue.push({
      event: sourceEvent,
      path: [{
        event_id: sourceEvent.event_id,
        event_name: sourceEvent.event_name,
        duration_minutes: getDurationMinutes(sourceEvent.start_date, sourceEvent.end_date)
      }],
      totalDuration: getDurationMinutes(sourceEvent.start_date, sourceEvent.end_date)
    });
  
    while (queue.length > 0) {
      const current = queue.shift();
      const currentEvent = current.event;
  
      if (currentEvent.event_id === targetEventId) {
        return {
          sourceEventId: sourceEventId,
          targetEventId: targetEventId,
          shortestPath: current.path,
          totalDurationMinutes: current.totalDuration,
          message: 'Shortest temporal path found from source to target event.'
        };
      }
  
      visited.add(currentEvent.event_id);
  
      const children = await getChildrenEvents(currentEvent.event_id);
      for (const child of children) {
        if (!visited.has(child.event_id)) {
          const duration = getDurationMinutes(child.start_date, child.end_date);
          queue.push({
            event: child,
            path: [...current.path, {
              event_id: child.event_id,
              event_name: child.event_name,
              duration_minutes: duration
            }],
            totalDuration: current.totalDuration + duration
          });
        }
      }
    }
  
    return {
      sourceEventId: sourceEventId,
      targetEventId: targetEventId,
      shortestPath: [],
      totalDurationMinutes: 0,
      message: 'No temporal path found from source to target event.'
    };
}

module.exports = { getOverlapEventPairs,findLargestTemporalGap, findShortestInfluencePath };

    
