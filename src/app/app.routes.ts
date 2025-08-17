@@ .. @@
       {
         path: 'tour-operators',
         loadComponent: () => import('./components/tour-operators/tour-operators.component').then(m => m.TourOperatorsComponent)
+      },
+      {
+        path: 'payment-types',
+        loadComponent: () => import('./components/payment-types/payment-types.component').then(m => m.PaymentTypesComponent)
       }
     ]
   }