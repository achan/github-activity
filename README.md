github-activity [![Build Status](https://travis-ci.org/achan/github-activity.png?branch=master)](https://travis-ci.org/achan/github-activity)
===============

This library displays the activity feed of a given GitHub user.

## Usage
Create a container for your activity feed along with a loading indicator that will be displayed while waiting for GitHub's response.

    <div id="activity-feed">Loading activity...</div>

If you want custom templates, you can create them as you would for any [Mustache templates](https://github.com/janl/mustache.js/). If no custom templates are provided, it will fallback to the default templates provided by the library.

**NOTE:** `githubActivity` provides a Mustache helper called `formatSha` that will shorten a changeset's SHA to 8 characters.

    <script type="text/template" id="no-events-tmpl">
      <div>There has been no recent activity.</div>
    </script>

    <script type="text/template" id="push-event-tmpl">
      <div class="event push-event">
        <div>{{created_at_in_words}}</div>
        <a href="http://github.com/{{actor.login}}">{{actor.login}}</a>
        pushed to <a href="http://github.com/{{repo.name}}">{{repo.name}}</a>
        <ul class="commits">
          {{#payload.commits}}
            <li class="commit">
              <span>{{#formatSha}}{{sha}}{{/formatSha}}</span>
              {{message}}
            </li>
          {{/payload.commits}}
        </ul>
      </div>
    </script>

    <script type="text/template" id="create-event-tmpl">
      <div class="event create-event">
        <div>{{created_at_in_words}}</div>
        <a href="http://github.com/{{actor.login}}">{{actor.login}}</a>
        created <a href="http://github.com/{{repo.name}}">{{repo.name}}</a>
      </div>
    </script>

All that's left to do is fire a GitHub Activity request with `requestActivity()`. `onCompleteCallback` will be called with the HTML compiled from your Mustache templates and GitHub's response.

    <script type="text/javascript">
      var options = {
        templates: {
          NoEvents: document.getElementById('no-events-tmpl').innerHTML,
          PushEvent: document.getElementById('push-event-tmpl').innerHTML,
          CreateEvent: document.getElementById('create-event-tmpl').innerHTML
        },
        username: 'achan',
        doc: document,
        onCompleteCallback: function (html) {
          document.getElementById('activity').innerHTML = html;
        }
      };

      githubActivity.requestActivity(options);
    </script>

## Bower
You can install this project with the [Bower](http://bower.io) package manager with the command `bower install github-activity`.

## Limitations
Since this plugin is using GitHub's public API via JSONP, it is subjected to GitHub's unauthenticated session API rate limit of 60 requests an hour.
