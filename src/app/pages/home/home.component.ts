import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../../core/content/profile';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly profile = PROFILE;
  readonly repos = PROFILE.openSourceFallback;

  ngOnInit(): void {
    this.seo.setPage({ path: '/' });
    this.seo.setPersonSchema();
  }

  resumeHref(): string {
    return '/Mohammed-Dabo-Resume.pdf';
  }
}
