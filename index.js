const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const username = 'hpcaitech';
const repoName = 'Open-Sora';
const token = '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';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/newsfeed', (req, res) => {
  try {
    res.render('index.ejs');
  } catch (error) {
    res.render('error.ejs', { error: 'Server is down, babe' });
  }
});

app.get('/api/commit-history', async (req, res) => {
  try {
    const commitsResponse = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/commits`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const commits = commitsResponse.data.map(commit => {
      return {
        sha: commit.sha,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date).toLocaleString(),
        message: commit.commit.message,
      };
    });

    res.json(commits);
  } catch (error) {
    console.error('Error fetching commit history:', error.message);
    res.status(500).json({ error: 'Error fetching commit history' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
