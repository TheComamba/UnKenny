export default class UnKennyNPC extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
          name: new fields.StringField({required: true, blank: false}),
          preamble: new fields.StringField({required: false, blank: false})
        }
      }
}