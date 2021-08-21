import { html, SkhemataBase, property, CSSResult,css } from '@skhemata/skhemata-base';
import Quill from 'quill';
import Delta from 'quill-delta';
import { Campaign } from '@skhemata/skhemata-api-client-js/dist/src/Campaign';
import { Skhemata } from '@skhemata/skhemata-api-client-js';

import { Snow } from './Snow';
export class SkhemataEditorQuill extends SkhemataBase {

  @property({ type: Campaign }) campaign?: Campaign;

  @property({ type: String}) campaignId;
  static get styles() {
    return <CSSResult[]> [
      Snow,
      css`
      .ql-editor {
        height: 250px;
      }
      `
    ];
  }

  @property({ type: Element }) quill: any = null;

  async firstUpdated(){
    super.firstUpdated();
    const element = <Element>this.shadowRoot?.getElementById('editor');
    const campaignId = this.campaignId;
    const api = this.api;
    let campaign = this.campaign;
    // Init skhemata auth
    if(!this.campaign && this.api.url){
      this.skhemata = new Skhemata(this.api.url);
      await this.skhemata.init()
        if(this.campaignId && this.skhemata.api.authToken){
          campaign = await this.skhemata?.getCampaign(this.campaignId);
          this.campaign = campaign;
        }
    } 

    this.quill = new Quill(element, {
      modules: { 
        toolbar: {
          container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
          
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            
            [{ 'align': [] }],['image']
          ],
          handlers: {
            'image': function () {
              let fileInput = this.container.querySelector('input.ql-image[type=file]');
              if (fileInput == null) {
                fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.setAttribute(
                  'accept',
                  'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
                );
                fileInput.classList.add('ql-image');
                fileInput.addEventListener('change', () => {
                  if (fileInput.files != null && fileInput.files[0] != null) {

                    // determine whether to save image to API or use default base64 rendering functionality
                    if(campaign && api.url) {
                      const formData = new FormData();
                      formData.append('resource_content_type', 'image');
                      formData.append('entry_id', '2');
                      formData.append('resource_type', 'file');
                      formData.append('X-Requested-With', 'xhr');
                      formData.append('resource', fileInput.files[0]);
                      let url = `${api.url}/campaign/${campaignId}/resource/file/`;
                      
                      const xhr = new XMLHttpRequest();
                      xhr.open('post', url, true);
                      xhr.setRequestHeader('x-auth-token', campaign?.api.authToken)

                      xhr.onload = () => {

                        if (xhr.status === 200) {
                          const res = JSON.parse(xhr.responseText);
                          const imgUrl = `${api['base']}/static/images/${res.path_external}`
                          const range = this.quill.getSelection();
                          this.quill.insertEmbed(range.index, 'image', imgUrl);
                        }
                      };
                      xhr.send(formData);
                    } else {
                      const newThis = this;
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        var range = newThis.quill.getSelection(true);

                        newThis.quill.updateContents(new Delta().retain(range.index).delete(range.length).insert({ image: e.target.result }));
                        newThis.quill.setSelection(range.index + 1, 'silent');
                        fileInput.value = "";
                      };
                      reader.readAsDataURL(fileInput.files[0]);

                    }
                  }
                });

                this.container.appendChild(fileInput);
              }
              fileInput.click();
            }
          }
        }         
      },

      theme: 'snow',
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
