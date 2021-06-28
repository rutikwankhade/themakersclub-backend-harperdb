const express = require('express');
const router = express.Router();

const linkPreviewGenerator = require("link-preview-generator");

router.get('/', async (req, res) => {

    const {url} = req.body

    try {
            const puppeteerArgs = ["--no-sandbox", "--disable-setuid-sandbox"];

        const previewData = await linkPreviewGenerator(url,puppeteerArgs);
        res.send(previewData);

    } catch (err) {

        res.status(500).send({ error: JSON.stringify(e.message) });
    }

});

module.exports = router;
