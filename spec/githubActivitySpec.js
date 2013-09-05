describe('GitHub Activity', function () {
  var templates;
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
    templates = {
      NoEvents: 'No Events',
      CreateEvent: 'Create Event'
    };
  });

  describe('formatFeed()', function () {
    it('should indicate when there has been no recent activity', function () {
      expect(githubActivity.formatFeed(templates)).toBe('No Events');
    });

    it('should display CreateEvents', function () {
      expect(githubActivity.formatFeed(templates, buildResponse('CreateEvent'))).toBe('Create Event');
    });

    it('should skip over unsupported events', function () {
      expect(githubActivity.formatFeed(templates, buildResponse(['CreateEvent', 'UnsupportedEvent'])))
        .toBe('Create Event');
    });

    it('should show No Events template if feed only contains unsupported events', function () {
      expect(githubActivity.formatFeed(templates, buildResponse(['UnsupportedEvent', 'UnsupportedEvent'])))
        .toBe('No Events');
    });
  });
});
