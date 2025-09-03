-- Script para popular o banco com os dados existentes
-- Execute após criar o schema

-- Inserir obras existentes
INSERT INTO public.works (title, images, focal_point, category) VALUES
('estudo de face', 
 ARRAY['/images/pecas/generated/estudo_face_1-900.webp', '/images/pecas/generated/estudo_face_2-900.webp', '/images/pecas/generated/estudo_face_3-900.webp'], 
 '50% 50%', 
 'work_in_progress'),

('prato com rosas', 
 ARRAY['/images/pecas/generated/prato_rosas_1-900.webp', '/images/pecas/generated/prato_rosas_2-900.webp'], 
 '50% 50%', 
 'gallery'),

('indígena', 
 ARRAY['/images/pecas/generated/indigena_1-900.webp', '/images/pecas/generated/indigena_2-900.webp', '/images/pecas/generated/indigena_3-900.webp'], 
 '50% 45%', 
 'gallery'),

('caveira samurai', 
 ARRAY['/images/pecas/generated/caveira_samurai_1-900.webp', '/images/pecas/generated/caveira_samurai_2-900.webp'], 
 '50% 50%', 
 'gallery'),

('corpo feminino', 
 ARRAY['/images/pecas/generated/corpo_feminino_1-900.webp', '/images/pecas/generated/corpo_feminino_2-900.webp'], 
 '50% 50%', 
 'gallery'),

('pensador', 
 ARRAY['/images/pecas/generated/pensador_1-900.webp', '/images/pecas/generated/pensador_2-900.webp', '/images/pecas/generated/pensador_3-900.webp'], 
 '50% 50%', 
 'gallery'),

('caveira iluminada', 
 ARRAY['/images/pecas/generated/caveira_iluminada_1-900.webp', '/images/pecas/generated/caveira_iluminada_2-900.webp', '/images/pecas/generated/caveira_iluminada_3-900.webp'], 
 '50% 50%', 
 'gallery'),

('mergulhador e o polvo', 
 ARRAY['/images/pecas/generated/polvo_mergulhador_1-900.webp', '/images/pecas/generated/polvo_mergulhador_2-900.webp'], 
 '50% 50%', 
 'work_in_progress'),

('são jorge', 
 ARRAY['/images/pecas/generated/sao_jorge_1-900.webp', '/images/pecas/generated/sao_jorge_2-900.webp', '/images/pecas/generated/sao_jorge_3-900.webp'], 
 '50% 50%', 
 'gallery');

