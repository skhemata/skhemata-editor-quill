import { html, SkhemataBase, property, CSSResult } from '@skhemata/skhemata-base';
import Quill from 'quill';
import Delta from 'quill-delta';
import { Snow } from './Snow';

export class SkhemataEditorQuill extends SkhemataBase {
  static get styles() {
    return <CSSResult[]> [
      Snow
    ];
  }

  @property({ type: Element }) quill: any = null;

  async firstUpdated(){
    super.firstUpdated();
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
