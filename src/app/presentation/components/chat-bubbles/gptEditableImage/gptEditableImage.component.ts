import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-gpt-editable-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gptEditableImage.component.html',
  styleUrl: './gptEditableImage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptEditableImageComponent implements AfterViewInit {


  @Input({ required: true }) text!: string;
  @Input({ required: true }) imageInfo!: { url: string, alt: string };

  @Output() onSelectedImage = new EventEmitter<string>();

  @ViewChild('canvas') canvaElement?: ElementRef<HTMLCanvasElement>;

  public originalImage = signal<HTMLImageElement | null>(null);
  public isDrawing = signal<boolean>(false);
  public coords = signal({ x: 0, y: 0 });


  ngAfterViewInit(): void {
    if(!this.canvaElement?.nativeElement) return;

    const canvas = this.canvaElement.nativeElement;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = this.imageInfo.url;

    this.originalImage.set(image);
    
    image.onload = () => {
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

  }

  onMouseEvent(event: MouseEvent) {
    if(!this.canvaElement?.nativeElement) return;

    this.isDrawing.set(true);

    const startX =event.clientX - this.canvaElement.nativeElement.getBoundingClientRect().left;
    const startY =event.clientY - this.canvaElement.nativeElement.getBoundingClientRect().top;
    
    this.coords.set({ x: startX, y: startY });



  }

  onMouseMove(event: MouseEvent) {
    if(!this.isDrawing())return;
    if(!this.canvaElement?.nativeElement) return;

    const canvaRef = this.canvaElement.nativeElement;
    const currentX = event.clientX - canvaRef.getBoundingClientRect().left;
    const currentY = event.clientY - canvaRef.getBoundingClientRect().top;

    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    const canvasWidth = canvaRef.width;
    const canvasHeight = canvaRef.height;

    const ctx = canvaRef.getContext('2d');

    ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx?.drawImage(this.originalImage()!, 0, 0, canvasWidth, canvasHeight);

    //ctx?.fillRect(this.coords().x, this.coords().y, width, height);
    ctx?.clearRect(this.coords().x, this.coords().y, width, height);

  }

  onMouseUp() {
    this.isDrawing.set(false);

    const canvas = this.canvaElement?.nativeElement;
    const url = canvas?.toDataURL('image/png');
    console.log(url)

    this.onSelectedImage.emit(url);


  }

  handleClick() {
    this.onSelectedImage.emit(this.imageInfo.url);
  }



}
