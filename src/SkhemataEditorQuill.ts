import { html, LitElement, property } from 'lit-element';
import Quill from 'quill';
import Delta from './delta/src/Delta';
import { Snow } from './Snow';

export class SkhemataEditorQuill extends LitElement {
  static get styles() {
    return [
      Snow
  ]
  }

  @property({ type: Element }) quill: any = null;

  firstUpdated(){
    const element = <Element>this.shadowRoot?.getElementById('editor');
    this.quill = new Quill(element, {
      modules: { toolbar: true },
      theme: 'snow'
    });
  }

  setContents(contents: any){
    const delta = new Delta(contents);
    this.quill.setContents(delta);
  }

  render() {
    return html`
      <div id="editor"></div>
    `;
  }
}
