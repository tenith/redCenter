import {
  Component,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  ElementRef,
  Input,
} from "@angular/core";
import { LocationStrategy } from "@angular/common";

@Component({
  selector: "ngx-tiny-mce",
  template: "",
})
export class TinyMCEComponent implements OnDestroy, AfterViewInit {
  @Output() editorKeyup = new EventEmitter<any>();

  @Input() height?: number;
  @Input() content?: string;

  editor: any;

  constructor(
    private host: ElementRef,
    private locationStrategy: LocationStrategy,
  ) {}

  ngAfterViewInit() {
    if (this.height == undefined) this.height = 320;
    tinymce.init({
      target: this.host.nativeElement,
      plugins: ["link", "paste", "table"],
      // toolbar: "styleselect fontselect fontsizeselect | forecolor backcolor",
      menubar: false,
      skin_url: `${this.locationStrategy.getBaseHref()}assets/skins/lightgray`,
      setup: (editor) => {
        this.editor = editor;
        editor.on("keyup", () => {
          this.editorKeyup.emit(editor.getContent());
        });
      },
      height: this.height,
    });

    if (this.content != undefined) {
      this.editor.setContent(this.content);
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
