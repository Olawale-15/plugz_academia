import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  imports: [CommonModule]
})
export class IconComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() icon!: string;
  @Input() size: string = '16';
  @Input() class = '';
  @Input() color: string = 'inherit';

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    this.renderIcon();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['icon'] || changes['size'] || changes['class']) {
      setTimeout(() => this.renderIcon(), 0);
    }
  }

  private renderIcon() {
    if (!this.icon) return;

    try {
      const element = this.elementRef.nativeElement;

      // Clear previous content
      element.innerHTML = '';

      // Get the icon SVG with proper typing
      const icons = feather.icons as { [key: string]: any };
      const iconSvg = icons[this.icon];

      if (iconSvg) {
        // Create SVG element
        const svgElement = iconSvg.toSvg({
          width: this.size,
          height: this.size,
          class: this.class,
          style: this.color ? `color: ${this.color}` : ''
        });

        // Insert SVG into component
        element.innerHTML = svgElement;
      } else {
        console.warn(`Feather icon '${this.icon}' not found`);
        // Fallback: create a placeholder
        element.innerHTML = `<div class="icon-placeholder" style="width:${this.size}px;height:${this.size}px;background:#ccc;border-radius:2px;"></div>`;
      }
    } catch (error) {
      console.error('Error rendering feather icon:', error);
      // Use the old method as fallback
      this.fallbackRenderIcon();
    }
  }

  private fallbackRenderIcon() {
    if (!this.icon) return;

    // Clear previous content
    this.elementRef.nativeElement.innerHTML = '';

    // Create new icon using data-feather attribute
    const iconElement = document.createElement('i');
    iconElement.setAttribute('data-feather', this.icon);
    if (this.class) {
      iconElement.className = this.class;
    }
    this.elementRef.nativeElement.appendChild(iconElement);

    // Render icon using feather.replace()
    feather.replace({
      width: this.size,
      height: this.size
    });
  }
}
