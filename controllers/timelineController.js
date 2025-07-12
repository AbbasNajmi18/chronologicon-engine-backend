const { getTimeline } = require('../services/timelineService');


async function getTimelineController(req, res) {
    const { rootEventId } = req.params;

    try {
        const timeline = await getTimeline(rootEventId);
        if (!timeline) {
            return res.status(404).json({ error: 'Timeline not found' });
        }
        res.status(200).json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getTimelineController };
