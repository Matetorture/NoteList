import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SettingsService } from "./services/settings.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.loadSettings();
  }
}
