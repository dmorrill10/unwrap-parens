'use babel';

import { CompositeDisposable } from 'atom';

export default {

  getEditor: function() {
    return atom.workspace.getActiveTextEditor();
  },

  Unwrapper: {
    OPEN_PARENS: {
      '(': true,
      '{': true,
      '[': true
    },
    CLOSED_PARENS: {
      ')': true,
      '}': true,
      ']': true
    },

    execute(text, num_spaces_per_indent = 2) {
      lines = text.split("\n");
      initialWhitespace = /^(\s*)/.exec(text)[0];
      trailingWhitespace = /(\s*)$/.exec(text)[0];
      for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
      }
      text = lines.join(' ');
      indent_level = 0;
      new_text = [initialWhitespace];
      whitespace = function() {
        if (indent_level >= 0) {
          return "\n" + initialWhitespace + (" ".repeat(num_spaces_per_indent * indent_level));
        } else {
          return "";
        }
      };
      for (var i = 0; i < text.length; i++) {
        char = text[i];
        if (char in this.OPEN_PARENS) {
          const previous = new_text[new_text.length - 1]
          if (previous in this.CLOSED_PARENS) {
            new_text.push(whitespace());
          }
          else if (previous === " " && new_text[new_text.length - 2] in this.CLOSED_PARENS) {
            new_text.pop();
            new_text.push(whitespace());
          }
          new_text.push(char);
          indent_level += 1;
          new_text.push(whitespace());
        }
        else if (char in this.CLOSED_PARENS) {
          indent_level -= 1;
          if (new_text[new_text.length - 1] in this.OPEN_PARENS) {
              new_text.pop();
          }
          else {
            new_text.push(whitespace());
          }
          new_text.push(char);
        }
        else {
          new_text.push(char);
        }
      }
      new_text.push(trailingWhitespace);
      return new_text.join('');
    }
  },

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'unwrap-parens:unwrap': () => this.unwrap()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return;
  },

  unwrap() {
    if (this.getEditor()) {
      this.handleLines();
    }
  },

  handleLines() {
    selectionList = this.getEditor().getSelections();
    for (var i = 0; i < selectionList.length; i++) {
      selection = selectionList[i];
      if (selection.isSingleScreenLine()) {
        selection.selectLine();
      }
      newText = this.Unwrapper.execute(selection.getText());
        selection.insertText(newText);
    }
    return;
  }


// handleMultiLine: =>
//   return unless atom.config.get('highlight-line.enableSelectionBorder')
//
//   selections = @getEditor().getSelections()
//   for selection in selections
//     unless selection.isSingleScreenLine()
//       selectionRange = selection.getBufferRange().copy()
//       topLine = selectionRange
//       bottomLine = selectionRange.copy()
//
//       topLine.end = topLine.start
//       bottomLine.start = new Point(bottomLine.end.row - 1,
//                                    bottomLine.end.column)


};
