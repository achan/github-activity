var githubActivity = (function() {
  var activity = {
    formatFeed: function (templates, events) {
      if (!events)
        return Mustache.render(templates.NoEvents);

      var output = '';
      for (var key in events.data) {
        var eventType = events.data[key].type;
        if (templates[eventType])
          output += Mustache.render(templates[eventType]);
      }

      return output === '' ? Mustache.render(templates.NoEvents) : output;
    }
  };

  return activity;
}) ();
