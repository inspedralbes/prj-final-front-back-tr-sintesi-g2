const express = require('express');
const cors = require('cors');
const path = require('path');
const archiver = require('archiver');

const startDownloadService = () => {
  const app = express();
  app.use(cors());

  app.get('/download-juego', (req, res) => {
    const folderPath = path.join(__dirname, '../juegoCo');

    res.setHeader('Content-Disposition', 'attachment; filename=juegoCo.zip');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => {
      console.error('Error creating archive:', err);
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
  });

  const DOWNLOAD_PORT = process.env.DOWNLOAD_PORT || 3015;

  app.listen(DOWNLOAD_PORT, () => {
    console.log(`Download service running on port ${DOWNLOAD_PORT}`);
  });
};

module.exports = { startDownloadService };
