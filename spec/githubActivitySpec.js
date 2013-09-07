describe('GitHub Activity', function () {
  var options, script, body, doc, callback;
  var pushEvent  = {
    id: "1818882042",
    type: "PushEvent",
    actor: {
      id: 549222,
      login: "achan",
      gravatar_id: "2fda97f2a1429546775f23374ebcdaaa",
      url: "https://api.github.com/users/achan",
      avatar_url: "https://1.gravatar.com/avatar/2fda97f2a1429546775f23374ebcdaaa?d=https%3A%2F%2Fa248.e.akamai.net%2Fassets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"
    },
    repo: {
      id: 12023116,
      name: "achan/ignoramos",
      url: "https://api.github.com/repos/achan/ignoramos"
    },
    payload: {
      push_id: 222577826,
      size: 2,
      distinct_size: 2,
      ref: "refs/heads/master",
      head: "37b13593646cbb070b8707325980b33658dc3eac",
      before: "571cdf42d6117cd4cce74d11963f3f6f49f02dcd",
      commits: [
        {
        sha: "abbb394160808619329950ac311290d371b00251",
        author: {
          email: "example@gmail.com",
          name: "Amos Chan"
        },
        message: "makes tag list optional when viewing post and refactors show_edit_post",
        distinct: true,
        url: "https://api.github.com/repos/achan/ignoramos/commits/abbb394160808619329950ac311290d371b00251"
      },
      {
        sha: "37b13593646cbb070b8707325980b33658dc3eac",
        author: {
          email: "example@gmail.com",
          name: "Amos Chan"
        },
        message: "orders latest by published_at DESC",
        distinct: true,
        url: "https://api.github.com/repos/achan/ignoramos/commits/37b13593646cbb070b8707325980b33658dc3eac"
      }
      ]
    },
    public: true,
    created_at: "2013-09-01T02:26:39Z"
  };

  var buildResponse = function (eventType) {
    var data = [];

    if (eventType instanceof Array) {
      for (var i in eventType) {
        data.push({ type: eventType[i] });
      }
    } else {
      data.push({ type: eventType });
    }

    return { data: data };
  };

  beforeEach(function() {
    script = {};
    body = { appendChild: function (child) {} };
    doc = {
      createElement: function (elementName) {},
      body: body 
    };
    callback = function (html) {};
    options = {
      templates: {
        NoEvents: 'No Events',
        CreateEvent: 'Create Event',
        PushEvent: 'Push Event repo name: {{repo.name}}'
      },
      username: 'testuser',
      doc: doc,
      onCompleteCallback: callback
    };

    spyOn(doc, 'createElement').andReturn(script);
    spyOn(body, 'appendChild');
    spyOn(options, 'onCompleteCallback');
    githubActivity.requestActivity(options);
  });

  describe('requestActivity()', function () {
    it('requests github activity for the username specified', function () {
      expect(doc.createElement).toHaveBeenCalledWith('script');
      expect(script.src).toContain('https://api.github.com/users/testuser/events');
    });

    it('sets showActivity() as the callback', function () {
      expect(script.src).toContain('?callback=githubActivity.showActivity');
    });

    it('appends script to body', function () {
      expect(body.appendChild).toHaveBeenCalledWith(script);
    });
  });

  describe('showActivity()', function () {
    it('should indicate when there has been no recent activity', function () {
      githubActivity.showActivity();
      expect(options.onCompleteCallback).toHaveBeenCalledWith('No Events');
    });

    it('should render supported events', function () {
      githubActivity.showActivity(buildResponse('CreateEvent'));
      expect(options.onCompleteCallback).toHaveBeenCalledWith('Create Event');
    });

    it('should render view variables', function () {
      githubActivity.showActivity({ data: [pushEvent] });
      expect(options.onCompleteCallback.mostRecentCall.args[0]).toContain('achan&#x2F;ignoramos');
    });

    it('should skip over unsupported events', function () {
      githubActivity.showActivity(buildResponse(['CreateEvent', 'UnsupportedEvent']));
      expect(options.onCompleteCallback).toHaveBeenCalledWith('Create Event');
    });

    it('should show No Events template if feed only contains unsupported events', function () {
      githubActivity.showActivity(buildResponse(['UnsupportedEvent', 'UnsupportedEvent']));
      expect(options.onCompleteCallback).toHaveBeenCalledWith('No Events');
    });

    it('should enhance view with created_at_in_words', function () {
      spyOn(Mustache, 'render');
      githubActivity.showActivity({ data: [pushEvent] });
      expect(Mustache.render.mostRecentCall.args[1].created_at_in_words).toContain(' ago');
    });

    it('should enhance view to add function to format sha', function () {
      var customEvent = {
        type: 'PushEvent',
        payload: { commits: [{ sha: '123456789653' }] }
      };

      var pushTemplate = '{{#payload.commits}}{{#formatSha}}{{sha}}{{/formatSha}}{{/payload.commits}}';
      options.templates.PushEvent = pushTemplate;
      githubActivity.requestActivity(options);
      githubActivity.showActivity({ data: [customEvent] });
      expect(options.onCompleteCallback.mostRecentCall.args[0]).toBe('1234567');
    });
  });
});
