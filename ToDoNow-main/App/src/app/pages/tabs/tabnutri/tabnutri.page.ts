import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-tabnutri',
  templateUrl: './tabnutri.page.html',
  styleUrls: ['./tabnutri.page.scss'],
})
export class TabnutriPage implements OnInit {

  food: Foods;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    const foodId = this.route.snapshot.paramMap.get('id');
    if (foodId) {
      this.getFoodDetails(foodId);
    } else {
      console.error('No food ID found in route');
    }
  }

  getFoodDetails(id: string) {
    this.firebaseSvc.getFoodById(id).subscribe(
      (food) => {
        this.food = food;
      },
      (error) => {
        console.error('Error fetching food details:', error);
      }
    );
  }
  
}