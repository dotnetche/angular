@@ .. @@
       {
         path: 'payment-types',
         loadComponent: () => import('./components/payment-types/payment-types.component').then(m => m.PaymentTypesComponent)
+      },
+      {
+        path: 'reservations',
+        loadComponent: () => import('./components/reservations/reservations.component').then(m => m.ReservationsComponent)
       }
     ]
   }