-- Database Schema for SwapMart Application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    onboard BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  products table (main swap listings)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    condition VARCHAR(50) NOT NULL, -- 'new', 'like-new', 'excellent', 'good', 'fair'
    original_price DECIMAL(10,2), -- Optional original price
    tags TEXT[],
    images JSONB DEFAULT '[]'::jsonb, -- Store image URLs and metadata
    wanted_category_id INTEGER REFERENCES categories(id), -- Optional preferred category
    wanted_condition VARCHAR(50), -- 'any', 'new', 'like-new', 'excellent', 'good'
    wanted_price_range VARCHAR(50), -- 'any', 'under-50', '50-100', etc.
    additional_notes TEXT,
    swap_preference VARCHAR(20) DEFAULT 'local', -- 'local', 'shipping', 'both'
    negotiable BOOLEAN DEFAULT TRUE,
    location VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'expired'
    is_available BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS swaps (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
    user_accepted BOOLEAN DEFAULT FALSE,
    buyer_accepted BOOLEAN DEFAULT FALSE,
    swaped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO swaps (
    product_id,
    offer_id,
    user_accepted,
    buyer_accepted,
    swaped
) VALUES
(1, 1, false, false, false),
(1, 2, true, false, false),
(1, 3, true, true, true);

INSERT INTO products (
    user_id, title, description, category_id, condition,
    original_price, tags, images, wanted_category_id,
    wanted_condition, wanted_price_range, additional_notes,
    swap_preference, negotiable, location, status,
    is_available, view_count
)
VALUES (
    1,
    'iPhone 12 - Like New',
    'Lightly used iPhone 12, 128GB, no scratches, works perfectly.',
    1,
    'like-new',
    699.00,
    ARRAY['electronics', 'smartphone', 'apple'],
    '[{"url": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7", "alt": "iPhone 12 front view"}, {"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "iPhone 12 back"}]'::jsonb,
    1,
    'like-new',
    'any',
    'Prefer Android phone swap or cash adjustment.',
    'both',
    TRUE,
    'New York, NY',
    'active',
    TRUE,
    10
);

-- 2. Swap: Acoustic Guitar
INSERT INTO products (
    user_id, title, description, category_id, condition,
    original_price, tags, images, wanted_category_id,
    wanted_condition, wanted_price_range, additional_notes,
    swap_preference, negotiable, location, status,
    is_available, view_count
)
VALUES (
    1,
    'Yamaha Acoustic Guitar - Excellent Condition',
    'Great sounding Yamaha acoustic guitar, perfect for beginners and pros.',
    2,
    'excellent',
    299.99,
    ARRAY['music', 'guitar', 'acoustic'],
    '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Acoustic guitar on chair"}]'::jsonb,
    3,
    'any',
    '50-100',
    'Open to trading for small home electronics or hobby gear.',
    'local',
    TRUE,
    'Austin, TX',
    'active',
    TRUE,
    4
);

-- 3. Swap: Lego Star Wars Set
INSERT INTO products (
    user_id, title, description, category_id, condition,
    original_price, tags, images, wanted_category_id,
    wanted_condition, wanted_price_range, additional_notes,
    swap_preference, negotiable, location, status,
    is_available, view_count
)
VALUES (
    1,
    'Lego Star Wars Millennium Falcon Set',
    'Complete set, all parts and manual included. Built once and kept on shelf.',
    4,
    'good',
    159.00,
    ARRAY['lego', 'star wars', 'toys'],
    '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "Lego Star Wars Millennium Falcon"}]'::jsonb,
    4,
    'good',
    'under-50',
    'Interested in board games or other Lego sets.',
    'shipping',
    FALSE,
    'Los Angeles, CA',
    'active',
    TRUE,
    7
);

INSERT INTO products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'iPhone 12', 'This is a great iPhone 12. Well-maintained and ready for use.', 5, 'good',
        920.17, ARRAY['iphone-12'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "iPhone 12"}]'::jsonb, 4,
        'any', '200+', 'Looking for something of equal value.',
        'local', FALSE, 'New York, NY', 'active',
        TRUE, 37, '2025-03-25 06:59:58',
        '2025-04-15 06:59:58'
    );

INSERT INTO products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Samsung Galaxy S21', 'This is a great Samsung Galaxy S21. Well-maintained and ready for use.', 1, 'like-new',
        85.46, ARRAY['samsung-galaxy-s21'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Samsung Galaxy S21"}]'::jsonb, 1,
        'excellent', 'any', 'Looking for something of equal value.',
        'shipping', FALSE, 'Los Angeles, CA', 'active',
        TRUE, 9, '2024-12-06 06:59:58',
        '2024-12-20 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Dell XPS 13', 'This is a great Dell XPS 13. Well-maintained and ready for use.', 5, 'good',
        709.71, ARRAY['dell-xps-13'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Dell XPS 13"}]'::jsonb, 4,
        'any', '200+', 'Looking for something of equal value.',
        'shipping', FALSE, 'Seattle, WA', 'active',
        TRUE, 22, '2025-07-11 06:59:58',
        '2025-07-18 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'MacBook Pro', 'This is a great MacBook Pro. Well-maintained and ready for use.', 4, 'excellent',
        978.9, ARRAY['macbook-pro'], '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "MacBook Pro"}]'::jsonb, 3,
        'excellent', 'under-50', 'Looking for something of equal value.',
        'shipping', TRUE, 'New York, NY', 'active',
        TRUE, 30, '2025-01-09 06:59:58',
        '2025-01-22 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Sony WH-1000XM4', 'This is a great Sony WH-1000XM4. Well-maintained and ready for use.', 3, 'new',
        467.17, ARRAY['sony-wh-1000xm4'], '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Sony WH-1000XM4"}]'::jsonb, 3,
        'good', '50-100', 'Looking for something of equal value.',
        'local', TRUE, 'New York, NY', 'active',
        TRUE, 49, '2025-02-20 06:59:58',
        '2025-03-15 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'GoPro Hero 9', 'This is a great GoPro Hero 9. Well-maintained and ready for use.', 3, 'good',
        860.45, ARRAY['gopro-hero-9'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "GoPro Hero 9"}]'::jsonb, 1,
        'new', '100-200', 'Looking for something of equal value.',
        'local', TRUE, 'Los Angeles, CA', 'active',
        TRUE, 47, '2024-11-23 06:59:58',
        '2024-12-12 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Canon EOS M50', 'This is a great Canon EOS M50. Well-maintained and ready for use.', 5, 'good',
        697.17, ARRAY['canon-eos-m50'], '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Canon EOS M50"}]'::jsonb, 2,
        'like-new', 'any', 'Looking for something of equal value.',
        'shipping', FALSE, 'New York, NY', 'active',
        TRUE, 3, '2025-04-13 06:59:58',
        '2025-05-05 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Nintendo Switch', 'This is a great Nintendo Switch. Well-maintained and ready for use.', 5, 'like-new',
        377.8, ARRAY['nintendo-switch'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Nintendo Switch"}]'::jsonb, 1,
        'excellent', 'any', 'Looking for something of equal value.',
        'both', TRUE, 'Austin, TX', 'active',
        TRUE, 16, '2025-07-23 06:59:58',
        '2025-07-23 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'PS5 Controller', 'This is a great PS5 Controller. Well-maintained and ready for use.', 5, 'excellent',
        991.28, ARRAY['ps5-controller'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "PS5 Controller"}]'::jsonb, 4,
        'excellent', 'under-50', 'Looking for something of equal value.',
        'shipping', FALSE, 'Seattle, WA', 'active',
        TRUE, 9, '2025-01-03 06:59:58',
        '2025-01-09 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Oculus Quest 2', 'This is a great Oculus Quest 2. Well-maintained and ready for use.', 2, 'fair',
        894.19, ARRAY['oculus-quest-2'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Oculus Quest 2"}]'::jsonb, 4,
        'like-new', '100-200', 'Looking for something of equal value.',
        'both', FALSE, 'New York, NY', 'active',
        TRUE, 3, '2024-09-14 06:59:58',
        '2024-10-06 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Yamaha Acoustic Guitar', 'This is a great Yamaha Acoustic Guitar. Well-maintained and ready for use.', 4, 'excellent',
        392.83, ARRAY['yamaha-acoustic-guitar'], '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "Yamaha Acoustic Guitar"}]'::jsonb, 5,
        'any', '100-200', 'Looking for something of equal value.',
        'shipping', TRUE, 'New York, NY', 'active',
        TRUE, 8, '2025-06-24 06:59:58',
        '2025-07-08 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Fender Stratocaster', 'This is a great Fender Stratocaster. Well-maintained and ready for use.', 1, 'new',
        711.67, ARRAY['fender-stratocaster'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Fender Stratocaster"}]'::jsonb, 1,
        'good', 'any', 'Looking for something of equal value.',
        'shipping', FALSE, 'New York, NY', 'active',
        TRUE, 9, '2024-11-30 06:59:58',
        '2024-12-30 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Lego Star Wars Set', 'This is a great Lego Star Wars Set. Well-maintained and ready for use.', 1, 'fair',
        301.34, ARRAY['lego-star-wars-set'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Lego Star Wars Set"}]'::jsonb, 4,
        'new', 'any', 'Looking for something of equal value.',
        'shipping', FALSE, 'Chicago, IL', 'active',
        TRUE, 47, '2024-12-29 06:59:58',
        '2025-01-01 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Lego Technic Car', 'This is a great Lego Technic Car. Well-maintained and ready for use.', 4, 'excellent',
        817.19, ARRAY['lego-technic-car'], '[{"url": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7", "alt": "Lego Technic Car"}]'::jsonb, 1,
        'like-new', '100-200', 'Looking for something of equal value.',
        'shipping', FALSE, 'Los Angeles, CA', 'active',
        TRUE, 13, '2025-02-06 06:59:58',
        '2025-03-07 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'KitchenAid Mixer', 'This is a great KitchenAid Mixer. Well-maintained and ready for use.', 1, 'excellent',
        106.76, ARRAY['kitchenaid-mixer'], '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "KitchenAid Mixer"}]'::jsonb, 5,
        'like-new', 'under-50', 'Looking for something of equal value.',
        'local', TRUE, 'Austin, TX', 'active',
        TRUE, 19, '2025-02-10 06:59:58',
        '2025-02-28 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Roomba i7', 'This is a great Roomba i7. Well-maintained and ready for use.', 5, 'excellent',
        659.32, ARRAY['roomba-i7'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Roomba i7"}]'::jsonb, 5,
        'any', '200+', 'Looking for something of equal value.',
        'both', FALSE, 'Austin, TX', 'active',
        TRUE, 9, '2024-11-27 06:59:58',
        '2024-12-12 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Instant Pot Duo', 'This is a great Instant Pot Duo. Well-maintained and ready for use.', 3, 'new',
        70.65, ARRAY['instant-pot-duo'], '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Instant Pot Duo"}]'::jsonb, 1,
        'new', '200+', 'Looking for something of equal value.',
        'shipping', TRUE, 'Seattle, WA', 'active',
        TRUE, 39, '2025-02-22 06:59:58',
        '2025-03-03 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Fitbit Charge 4', 'This is a great Fitbit Charge 4. Well-maintained and ready for use.', 4, 'excellent',
        982.69, ARRAY['fitbit-charge-4'], '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "Fitbit Charge 4"}]'::jsonb, 3,
        'new', '200+', 'Looking for something of equal value.',
        'local', FALSE, 'Los Angeles, CA', 'active',
        TRUE, 33, '2025-04-12 06:59:58',
        '2025-05-02 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Garmin Forerunner', 'This is a great Garmin Forerunner. Well-maintained and ready for use.', 4, 'like-new',
        82.13, ARRAY['garmin-forerunner'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Garmin Forerunner"}]'::jsonb, 5,
        'good', '200+', 'Looking for something of equal value.',
        'shipping', FALSE, 'Seattle, WA', 'active',
        TRUE, 12, '2024-11-06 06:59:58',
        '2024-12-01 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Skateboard Deck', 'This is a great Skateboard Deck. Well-maintained and ready for use.', 4, 'new',
        295.27, ARRAY['skateboard-deck'], '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Skateboard Deck"}]'::jsonb, 5,
        'excellent', '100-200', 'Looking for something of equal value.',
        'both', FALSE, 'Los Angeles, CA', 'active',
        TRUE, 27, '2024-09-08 06:59:58',
        '2024-09-24 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'BMX Bike', 'This is a great BMX Bike. Well-maintained and ready for use.', 1, 'like-new',
        539.36, ARRAY['bmx-bike'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "BMX Bike"}]'::jsonb, 1,
        'like-new', '50-100', 'Looking for something of equal value.',
        'local', FALSE, 'Seattle, WA', 'active',
        TRUE, 33, '2025-03-18 06:59:58',
        '2025-04-16 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Camping Tent', 'This is a great Camping Tent. Well-maintained and ready for use.', 3, 'fair',
        667.19, ARRAY['camping-tent'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Camping Tent"}]'::jsonb, 2,
        'any', '50-100', 'Looking for something of equal value.',
        'both', FALSE, 'New York, NY', 'active',
        TRUE, 43, '2024-10-24 06:59:58',
        '2024-11-10 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Snowboard', 'This is a great Snowboard. Well-maintained and ready for use.', 3, 'like-new',
        857.4, ARRAY['snowboard'], '[{"url": "https://images.unsplash.com/photo-1604066867775-43f48b2f36e1", "alt": "Snowboard"}]'::jsonb, 2,
        'good', 'under-50', 'Looking for something of equal value.',
        'local', FALSE, 'Los Angeles, CA', 'active',
        TRUE, 2, '2024-12-17 06:59:58',
        '2024-12-19 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Rollerblades', 'This is a great Rollerblades. Well-maintained and ready for use.', 5, 'like-new',
        613.42, ARRAY['rollerblades'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Rollerblades"}]'::jsonb, 4,
        'any', '50-100', 'Looking for something of equal value.',
        'local', TRUE, 'Austin, TX', 'active',
        TRUE, 48, '2025-07-26 06:59:58',
        '2025-08-23 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Board Game: Catan', 'This is a great Board Game: Catan. Well-maintained and ready for use.', 1, 'fair',
        316.4, ARRAY['board-game:-catan'], '[{"url": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7", "alt": "Board Game: Catan"}]'::jsonb, 1,
        'new', 'under-50', 'Looking for something of equal value.',
        'both', FALSE, 'Austin, TX', 'active',
        TRUE, 46, '2024-12-09 06:59:58',
        '2024-12-19 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Chess Set', 'This is a great Chess Set. Well-maintained and ready for use.', 1, 'fair',
        327.78, ARRAY['chess-set'], '[{"url": "https://images.unsplash.com/photo-1582719478185-6d20f98dfb08", "alt": "Chess Set"}]'::jsonb, 5,
        'good', '100-200', 'Looking for something of equal value.',
        'local', TRUE, 'Austin, TX', 'active',
        TRUE, 6, '2025-02-09 06:59:58',
        '2025-03-08 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, '3D Printer', 'This is a great 3D Printer. Well-maintained and ready for use.', 4, 'excellent',
        971.74, ARRAY['3d-printer'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "3D Printer"}]'::jsonb, 3,
        'any', '200+', 'Looking for something of equal value.',
        'shipping', FALSE, 'Seattle, WA', 'active',
        TRUE, 33, '2025-03-31 06:59:58',
        '2025-04-01 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Graphics Tablet', 'This is a great Graphics Tablet. Well-maintained and ready for use.', 3, 'good',
        45.48, ARRAY['graphics-tablet'], '[{"url": "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7", "alt": "Graphics Tablet"}]'::jsonb, 2,
        'new', 'under-50', 'Looking for something of equal value.',
        'shipping', TRUE, 'Chicago, IL', 'active',
        TRUE, 6, '2024-10-07 06:59:58',
        '2024-11-01 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Bluetooth Speaker', 'This is a great Bluetooth Speaker. Well-maintained and ready for use.', 2, 'like-new',
        448.11, ARRAY['bluetooth-speaker'], '[{"url": "https://images.unsplash.com/photo-1616627989390-bbd0b1d4724a", "alt": "Bluetooth Speaker"}]'::jsonb, 2,
        'like-new', 'any', 'Looking for something of equal value.',
        'local', TRUE, 'New York, NY', 'active',
        TRUE, 4, '2025-04-15 06:59:58',
        '2025-04-18 06:59:58'
    );

INSERT INTO  products (
        user_id, title, description, category_id, condition,
        original_price, tags, images, wanted_category_id,
        wanted_condition, wanted_price_range, additional_notes,
        swap_preference, negotiable, location, status,
        is_available, view_count, created_at, updated_at
    ) VALUES (
        1, 'Mechanical Keyboard', 'This is a great Mechanical Keyboard. Well-maintained and ready for use.', 1, 'fair',
        907.41, ARRAY['mechanical-keyboard'], '[{"url": "https://images.unsplash.com/photo-1603898037225-0e054fa5c843", "alt": "Mechanical Keyboard"}]'::jsonb, 1,
        'new', '100-200', 'Looking for something of equal value.',
        'shipping', TRUE, 'Los Angeles, CA', 'active',
        TRUE, 42, '2025-01-04 06:59:58',
        '2025-02-02 06:59:58'
    );

-- Wanted items table (separate table for wanted items)
CREATE TABLE IF NOT EXISTS wanted_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES  products(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1, -- 1 = highest priority
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO wanted_items (product_id, item_name, description, priority)
VALUES
  (4, 'Laptop', 'High-performance laptop needed for software development', 1),
  (4, 'Office Chair', 'Ergonomic chair for long working hours', 2),
  (5, 'External Monitor', '27-inch 4K monitor for design work', 2),
  (7, 'Notebook', 'Spiral notebook for taking daily notes', 3),
  (7, 'Smartphone', 'Latest model with high camera quality', 1);


-- Offers table
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    offered_item_title VARCHAR(255) NOT NULL,
    offered_item_description TEXT,
    offered_item_images JSONB DEFAULT '[]'::jsonb,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

INSERT INTO offers (
    buyer_id,
    product_id,
    offered_item_title,
    offered_item_description,
    offered_item_images,
    message,
    status
) VALUES
(1, 4,  'Used iPhone X', 'A well-kept iPhone X with minor scratches.', '["img1.jpg", "img2.jpg"]', 'Would you like to swap this with your product?', 'pending'),
(1, 4, 'Bluetooth Speaker', 'Almost new JBL speaker, great sound.', '["jbl1.jpg", "jbl2.jpg"]', 'Interested in a trade?', 'pending'),
(1, 4, 'Mountain Bike', 'Lightly used mountain bike, great condition.', '["bike1.jpg", "bike2.jpg"]', 'Let me know if you like this.', 'accepted');


-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES  products(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id),
    reviewed_user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES  products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved items table
CREATE TABLE IF NOT EXISTS saved_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES  products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, swap_id)
);

-- User activity table
CREATE TABLE IF NOT EXISTS user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(50), -- login, swap_view, offer_made, etc.
    activity_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, laptops, gadgets and more', 'phone'),
('Fashion', 'Clothing, shoes, accessories', 'shirt'),
('Home & Garden', 'Furniture, decor, tools', 'home'),
('Sports & Outdoors', 'Equipment, gear, fitness', 'fitness'),
('Books & Media', 'Books, movies, music', 'book'),
('Toys & Games', 'Board games, toys, collectibles', 'game-controller'),
('Automotive', 'Car parts, accessories, tools', 'car'),
('Health & Beauty', 'Cosmetics, wellness, personal care', 'heart'),
('Art & Collectibles', 'Paintings, antiques, memorabilia', 'brush'),
('Other', 'Everything else', 'ellipsis-horizontal')
ON CONFLICT DO NOTHING;

INSERT INTO swaps (product_id, offer_id, user_accepted, buyer_accepted, swaped, created_at, updated_at) VALUES
(4, 1, TRUE, FALSE, FALSE, '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(5, 2, TRUE, TRUE, TRUE, '2024-01-14 14:20:00', '2024-01-16 09:15:00'),
(7, 3, FALSE, FALSE, FALSE, '2024-01-13 16:45:00', '2024-01-13 16:45:00');

CREATE TABLE IF NOT EXISTS recent_views (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Liked Products table - tracks user likes on products
CREATE TABLE IF NOT EXISTS liked_products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

ATE INDEX IF NOT EXISTS idx_recent_views_user_id ON recent_views(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_views_product_id ON recent_views(product_id);
CREATE INDEX IF NOT EXISTS idx_recent_views_viewed_at ON recent_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_liked_products_user_id ON liked_products(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_products_product_id ON liked_products(product_id);
CREATE INDEX IF NOT EXISTS idx_liked_products_liked_at ON liked_products(liked_at DESC);

-- Sample data for recent_views
INSERT INTO recent_views (user_id, product_id, viewed_at) VALUES
(1, 4, '2025-08-22 10:30:00'),
(1, 5, '2025-08-22 10:25:00'),
(1, 7, '2025-08-22 10:20:00'),
(1, 18, '2025-08-22 10:15:00'),
(1, 9, '2025-08-22 10:10:00'),
(1, 10, '2025-08-22 10:05:00'),
(1, 15, '2025-08-22 10:00:00'),
(1, 12, '2025-08-22 09:55:00'),
(1, 13, '2025-08-22 09:50:00'),
(1, 14, '2025-08-22 09:45:00')
ON CONFLICT (user_id, product_id) DO UPDATE SET viewed_at = EXCLUDED.viewed_at;

-- Sample data for liked_products
INSERT INTO liked_products (user_id, product_id, liked_at) VALUES
(1, 4, '2025-08-22 11:00:00'),
(1, 7, '2025-08-22 10:45:00'),
(1, 9, '2025-08-22 10:30:00'),
(1, 12, '2025-08-22 10:15:00'),
(1, 15, '2025-08-22 10:00:00'),
(1, 18, '2025-08-22 09:45:00'),
(1, 21, '2025-08-22 09:30:00'),
(1, 24, '2025-08-22 09:15:00')
ON CONFLICT (user_id, product_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    type VARCHAR(20) DEFAULT 'info', -- success, message, reminder, info, etc.
    icon VARCHAR(30) DEFAULT 'notifications-outline',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ products_user_id ON  products(user_id);
CREATE INDEX IF NOT EXISTS idx_ products_category_id ON  products(category_id);
CREATE INDEX IF NOT EXISTS idx_wanted_items_product_id ON wanted_items(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id); 