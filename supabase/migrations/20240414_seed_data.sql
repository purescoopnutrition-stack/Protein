-- Seed initial categories to match website structure
INSERT INTO public.categories (id, name, slug, description, image_url, position, is_active)
VALUES
  (gen_random_uuid(), 'Whey Protein', 'whey-protein', 'High-quality whey protein for muscle recovery', '/assets/categories/whey_protein_300x.avif', 1, true),
  (gen_random_uuid(), 'Gainer', 'gainer', 'Weight and mass gainers', '/assets/categories/Mass_Weight_Gain_300x.avif', 2, true),
  (gen_random_uuid(), 'Fat Burner', 'fat-burner', 'Effective fat loss supplements', '/assets/categories/Fat_Weight_Loss_300x.avif', 3, true),
  (gen_random_uuid(), 'Pre-Workout', 'pre-workout', 'Energy and focus for your workouts', '/assets/categories/Pre_Workout_300x.avif', 4, true),
  (gen_random_uuid(), 'Creatine', 'creatine', 'Strength and performance booster', '/assets/categories/creatine_300x.avif', 5, true),
  (gen_random_uuid(), 'Wellness', 'wellness', 'General health and wellness', '/assets/categories/wellness_300x.avif', 6, true),
  (gen_random_uuid(), 'Others', 'others', 'Workout essentials and other supplements', '/assets/categories/Workout_Essentials_300x.avif', 7, true)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  position = EXCLUDED.position;

-- Seed some initial brands
INSERT INTO public.brands (id, name, slug, position, is_active)
VALUES
  (gen_random_uuid(), 'Optimum Nutrition', 'optimum-nutrition', 1, true),
  (gen_random_uuid(), 'MuscleTech', 'muscletech', 2, true),
  (gen_random_uuid(), 'MyProtein', 'myprotein', 3, true),
  (gen_random_uuid(), 'Ultimate Nutrition', 'ultimate-nutrition', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
