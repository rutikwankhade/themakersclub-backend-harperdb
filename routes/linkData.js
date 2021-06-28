const express = require('express');
const router = express.Router();

const linkPreviewGenerator = require("link-preview-generator");

router.get('/', async (req, res) => {

    const url = req.body.url

    try {
        const previewData = await linkPreviewGenerator(url);
        res.send(JSON.stringify(previewData));

    } catch (err) {

        res.status(500).send({ error: JSON.stringify(e.message) });
    }

});

module.exports = router;
