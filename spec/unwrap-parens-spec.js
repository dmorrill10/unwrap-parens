'use babel';
import UnwrapParens from '../lib/unwrap-parens';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('UnwrapParens', () => {
  describe('unwrapParens', () => {
    it('leaves simple strings unchanged', () => {
      text = 'if spell.cost <= remaining_mana:';
      x = text;
      expect(UnwrapParens.Unwrapper.execute(text)).toBe(x);
    });
    it('unwraps strings with one paren pair', () => {
      text = 'if (spell.cost <= remaining_mana):';
      x = "if (\n\
  spell.cost <= remaining_mana\n\
):";
      expect(UnwrapParens.Unwrapper.execute(text)).toBe(x);
    });
    it('unwraps complicated strings', () => {
      text = 'if spell.cost <= remaining_mana and ((remaining_hp - element_damage) <= 0\n\
      or (self.memo[(remaining_hp, remaining_mana)] == self.memo[(remaining_hp - element_damage, after_mana)] + 1)):'
      x = 'if spell.cost <= remaining_mana and (\n\
  (\n\
    remaining_hp - element_damage\n\
  ) <= 0 or (\n\
    self.memo[\n\
      (\n\
        remaining_hp, remaining_mana\n\
      )\n\
    ] == self.memo[\n\
      (\n\
        remaining_hp - element_damage, after_mana\n\
      )\n\
    ] + 1\n\
  )\n\
):'
      expect(UnwrapParens.Unwrapper.execute(text)).toBe(x);
    });
  });
});
