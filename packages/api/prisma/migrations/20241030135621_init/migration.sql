-- CreateTable
CREATE TABLE `wp_nepaz2_users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_login` VARCHAR(191) NOT NULL,
    `user_pass` VARCHAR(191) NOT NULL,
    `user_nicename` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_url` VARCHAR(191) NULL,
    `user_registered` DATETIME(3) NOT NULL,
    `user_activation_key` VARCHAR(191) NULL,
    `user_status` INTEGER NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `google_auth_token` LONGTEXT NOT NULL,
    `facebook_auth_token` LONGTEXT NOT NULL,
    `is_delete` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `wp_nepaz2_users_user_login_key`(`user_login`),
    UNIQUE INDEX `wp_nepaz2_users_user_email_key`(`user_email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nepaz2_usermeta` (
    `umeta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    PRIMARY KEY (`umeta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nepaz2_terms` (
    `term_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` LONGTEXT NULL,
    `slug` VARCHAR(191) NULL,
    `term_group` BIGINT NULL,

    PRIMARY KEY (`term_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_nepaz2_term_taxonomy` (
    `term_taxonomy_id` BIGINT NOT NULL AUTO_INCREMENT,
    `term_id` BIGINT NOT NULL,
    `taxonomy` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `parent` BIGINT NULL,
    `count` BIGINT NULL,

    PRIMARY KEY (`term_taxonomy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_posts` (
    `ID` BIGINT NOT NULL AUTO_INCREMENT,
    `post_author` BIGINT NOT NULL DEFAULT 0,
    `post_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_date_gmt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_content` LONGTEXT NOT NULL,
    `post_title` VARCHAR(191) NOT NULL,
    `post_excerpt` VARCHAR(191) NOT NULL,
    `post_status` VARCHAR(20) NOT NULL DEFAULT 'publish',
    `comment_status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `ping_status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `post_password` VARCHAR(255) NOT NULL DEFAULT '',
    `post_name` VARCHAR(200) NOT NULL DEFAULT '',
    `to_ping` VARCHAR(191) NOT NULL,
    `pinged` VARCHAR(191) NOT NULL,
    `post_modified` DATETIME(3) NOT NULL,
    `post_modified_gmt` DATETIME(3) NOT NULL,
    `post_content_filtered` VARCHAR(191) NOT NULL,
    `post_parent` BIGINT NULL DEFAULT 2,
    `guid` VARCHAR(255) NOT NULL DEFAULT '',
    `menu_order` INTEGER NOT NULL DEFAULT 0,
    `post_type` VARCHAR(20) NOT NULL DEFAULT 'post',
    `post_mime_type` VARCHAR(100) NOT NULL DEFAULT '',
    `comment_count` BIGINT NOT NULL DEFAULT 0,
    `is_deleted` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_postmeta` (
    `meta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL DEFAULT 0,
    `meta_key` VARCHAR(255) NULL,
    `meta_value` LONGTEXT NULL,

    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_term_relationships` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `object_id` BIGINT NOT NULL,
    `term_taxonomy_id` BIGINT NOT NULL,
    `term_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_woocommerce_attribute_taxonomies` (
    `attribute_id` BIGINT NOT NULL AUTO_INCREMENT,
    `attribute_name` VARCHAR(191) NOT NULL,
    `attribute_label` VARCHAR(191) NOT NULL,
    `attribute_type` VARCHAR(191) NOT NULL,
    `attribute_orderby` VARCHAR(191) NOT NULL,
    `attribute_public` INTEGER NOT NULL,

    PRIMARY KEY (`attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wc_product_attributes_lookup` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `product_or_parent_id` BIGINT NOT NULL,
    `taxonomy` VARCHAR(32) NOT NULL,
    `term_id` BIGINT NOT NULL,
    `is_variation_attribute` INTEGER NOT NULL,
    `in_stock` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `code_verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identity` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `code_verification_identity_key`(`identity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_options` (
    `option_id` BIGINT NOT NULL AUTO_INCREMENT,
    `option_name` VARCHAR(255) NOT NULL,
    `option_value` LONGTEXT NOT NULL,
    `autoload` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_fep_messages` (
    `mgs_id` BIGINT NOT NULL AUTO_INCREMENT,
    `mgs_parent` BIGINT NOT NULL,
    `mgs_author` BIGINT NOT NULL,
    `mgs_created` DATETIME(3) NOT NULL,
    `mgs_title` VARCHAR(191) NOT NULL,
    `mgs_content` LONGTEXT NOT NULL,
    `mgs_type` VARCHAR(20) NOT NULL,
    `mgs_status` VARCHAR(20) NOT NULL,
    `mgs_last_reply_by` BIGINT NOT NULL,
    `mgs_last_reply_time` DATETIME(3) NOT NULL,
    `mgs_last_reply_excerpt` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`mgs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_fep_participants` (
    `per_id` BIGINT NOT NULL AUTO_INCREMENT,
    `mgs_id` BIGINT NOT NULL,
    `mgs_participant` BIGINT NOT NULL,
    `mgs_read` BIGINT NOT NULL,
    `mgs_parent_read` BIGINT NOT NULL,
    `mgs_deleted` BIGINT NOT NULL,
    `mgs_archived` BIGINT NOT NULL,

    PRIMARY KEY (`per_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_fep_messagemeta` (
    `meta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `fep_message_id` BIGINT NOT NULL,
    `meta_key` VARCHAR(255) NOT NULL,
    `meta_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_fep_attachments` (
    `att_id` BIGINT NOT NULL AUTO_INCREMENT,
    `mgs_id` BIGINT NOT NULL,
    `att_mime` VARCHAR(100) NOT NULL,
    `att_file` VARCHAR(255) NOT NULL,
    `att_status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`att_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_termmeta` (
    `meta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `term_id` BIGINT NOT NULL,
    `meta_key` VARCHAR(255) NOT NULL,
    `meta_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_privacy_policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_term_condition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_about_us` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homepage_banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_dokan_follow_store_followers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vendor_id` BIGINT NOT NULL,
    `follower_id` BIGINT NOT NULL,
    `followed_at` DATETIME(3) NOT NULL,
    `unfollowed_at` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_add_product_fav` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_add_product_cart` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recently_viewed_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_code` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `coupon_type` VARCHAR(191) NOT NULL,
    `coupon_amount` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `sellerId` BIGINT NOT NULL DEFAULT 0,
    `uses` INTEGER NOT NULL,
    `minimum_spent` INTEGER NOT NULL,
    `maximum_spent` INTEGER NOT NULL,
    `limit` INTEGER NOT NULL,
    `limit_per_item` INTEGER NOT NULL,
    `limit_per_user` INTEGER NOT NULL,
    `expire_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_dokan_orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `seller_id` BIGINT NOT NULL,
    `order_total` DECIMAL(65, 30) NOT NULL,
    `net_amount` DECIMAL(65, 30) NOT NULL,
    `order_status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wc_order_product_lookup` (
    `order_item_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `variation_id` BIGINT NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `date_created` DATETIME(3) NOT NULL,
    `product_qty` INTEGER NOT NULL,
    `product_net_revenue` DECIMAL(65, 30) NOT NULL,
    `product_gross_revenue` DECIMAL(65, 30) NOT NULL,
    `coupon_amount` DECIMAL(65, 30) NOT NULL,
    `tax_amount` DECIMAL(65, 30) NOT NULL,
    `shipping_amount` DECIMAL(65, 30) NOT NULL,
    `shipping_tax_amount` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_wc_order_stats` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `parent_id` BIGINT NOT NULL,
    `date_created` DATETIME(3) NOT NULL,
    `date_created_gmt` DATETIME(3) NOT NULL,
    `num_items_sold` INTEGER NOT NULL,
    `total_sales` DECIMAL(65, 30) NOT NULL,
    `tax_total` DECIMAL(65, 30) NOT NULL,
    `shipping_total` DECIMAL(65, 30) NOT NULL,
    `net_total` DECIMAL(65, 30) NOT NULL,
    `returning_customer` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `date_paid` DATETIME(3) NOT NULL,
    `date_completed` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_woocommerce_order_items` (
    `order_item_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_item_name` VARCHAR(191) NOT NULL,
    `order_item_type` VARCHAR(191) NOT NULL,
    `order_id` BIGINT NOT NULL,

    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_woocommerce_order_itemmeta` (
    `meta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_item_id` BIGINT NOT NULL,
    `meta_key` VARCHAR(191) NOT NULL,
    `meta_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_comments` (
    `comment_ID` BIGINT NOT NULL AUTO_INCREMENT,
    `comment_post_ID` BIGINT NOT NULL,
    `comment_author` BIGINT NOT NULL,
    `comment_author_email` VARCHAR(100) NOT NULL,
    `comment_author_url` VARCHAR(200) NOT NULL,
    `comment_author_IP` VARCHAR(100) NOT NULL,
    `comment_date` DATETIME(3) NOT NULL,
    `comment_date_gmt` DATETIME(3) NOT NULL,
    `comment_content` TEXT NOT NULL,
    `comment_karma` INTEGER NOT NULL,
    `comment_approved` VARCHAR(191) NOT NULL,
    `comment_agent` VARCHAR(255) NOT NULL,
    `comment_type` VARCHAR(20) NOT NULL,
    `comment_parent` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `comment_title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`comment_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wp_commentmeta` (
    `meta_id` BIGINT NOT NULL AUTO_INCREMENT,
    `comment_id` BIGINT NOT NULL,
    `meta_key` VARCHAR(255) NOT NULL,
    `meta_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`meta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_likes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_comments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `parent` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `heading` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `play_store_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `summer_specific_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `term_taxonomy_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_address` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `street1` VARCHAR(255) NOT NULL,
    `street2` VARCHAR(255) NOT NULL,
    `country` VARCHAR(125) NOT NULL,
    `state` VARCHAR(125) NOT NULL,
    `city` VARCHAR(125) NOT NULL,
    `zipcode` VARCHAR(125) NOT NULL,
    `lat` VARCHAR(125) NOT NULL,
    `lng` VARCHAR(125) NOT NULL,
    `default` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL DEFAULT '',
    `phone_number` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `auther_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL DEFAULT 0,
    `order_id` BIGINT NOT NULL DEFAULT 0,
    `type` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `color` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_feedback` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `share_product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `share_on` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_notes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT NOT NULL,
    `comment_author` BIGINT NOT NULL,
    `comment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` LONGTEXT NOT NULL,
    `attachment` VARCHAR(255) NOT NULL,
    `comment_title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `variables` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fizno_commission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `commission_fee` INTEGER NOT NULL,
    `payment_fee` INTEGER NOT NULL,
    `sale_tax` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seller_earning` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `seller_id` BIGINT NOT NULL,
    `sale_tax` DECIMAL(65, 30) NOT NULL,
    `commission_fee` DECIMAL(65, 30) NOT NULL,
    `payment_fee` DECIMAL(65, 30) NOT NULL,
    `earning` DECIMAL(65, 30) NOT NULL,
    `order_total` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_request` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `seller_id` BIGINT NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_coupon_codeTowp_nepaz2_term_taxonomy` (
    `A` BIGINT NOT NULL,
    `B` BIGINT NOT NULL,

    UNIQUE INDEX `_coupon_codeTowp_nepaz2_term_taxonomy_AB_unique`(`A`, `B`),
    INDEX `_coupon_codeTowp_nepaz2_term_taxonomy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wp_nepaz2_usermeta` ADD CONSTRAINT `wp_nepaz2_usermeta_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_nepaz2_term_taxonomy` ADD CONSTRAINT `wp_nepaz2_term_taxonomy_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `wp_nepaz2_terms`(`term_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_posts` ADD CONSTRAINT `wp_posts_post_author_fkey` FOREIGN KEY (`post_author`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_posts` ADD CONSTRAINT `wp_posts_post_parent_fkey` FOREIGN KEY (`post_parent`) REFERENCES `wp_posts`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_postmeta` ADD CONSTRAINT `wp_postmeta_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_term_relationships` ADD CONSTRAINT `wp_term_relationships_object_id_fkey` FOREIGN KEY (`object_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_term_relationships` ADD CONSTRAINT `wp_term_relationships_term_taxonomy_id_fkey` FOREIGN KEY (`term_taxonomy_id`) REFERENCES `wp_nepaz2_term_taxonomy`(`term_taxonomy_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_product_attributes_lookup` ADD CONSTRAINT `wp_wc_product_attributes_lookup_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_product_attributes_lookup` ADD CONSTRAINT `wp_wc_product_attributes_lookup_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `wp_nepaz2_terms`(`term_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_fep_messages` ADD CONSTRAINT `wp_fep_messages_mgs_author_fkey` FOREIGN KEY (`mgs_author`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_fep_participants` ADD CONSTRAINT `wp_fep_participants_mgs_id_fkey` FOREIGN KEY (`mgs_id`) REFERENCES `wp_fep_messages`(`mgs_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_fep_participants` ADD CONSTRAINT `wp_fep_participants_mgs_participant_fkey` FOREIGN KEY (`mgs_participant`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_fep_messagemeta` ADD CONSTRAINT `wp_fep_messagemeta_fep_message_id_fkey` FOREIGN KEY (`fep_message_id`) REFERENCES `wp_fep_messages`(`mgs_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_fep_attachments` ADD CONSTRAINT `wp_fep_attachments_mgs_id_fkey` FOREIGN KEY (`mgs_id`) REFERENCES `wp_fep_messages`(`mgs_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_termmeta` ADD CONSTRAINT `wp_termmeta_term_id_fkey` FOREIGN KEY (`term_id`) REFERENCES `wp_nepaz2_terms`(`term_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_dokan_follow_store_followers` ADD CONSTRAINT `wp_dokan_follow_store_followers_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_dokan_follow_store_followers` ADD CONSTRAINT `wp_dokan_follow_store_followers_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_add_product_fav` ADD CONSTRAINT `wp_add_product_fav_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_add_product_fav` ADD CONSTRAINT `wp_add_product_fav_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_add_product_cart` ADD CONSTRAINT `wp_add_product_cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_add_product_cart` ADD CONSTRAINT `wp_add_product_cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feature_product` ADD CONSTRAINT `feature_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recently_viewed_product` ADD CONSTRAINT `recently_viewed_product_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recently_viewed_product` ADD CONSTRAINT `recently_viewed_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coupon_code` ADD CONSTRAINT `coupon_code_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_dokan_orders` ADD CONSTRAINT `wp_dokan_orders_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_dokan_orders` ADD CONSTRAINT `wp_dokan_orders_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_order_product_lookup` ADD CONSTRAINT `wp_wc_order_product_lookup_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_order_product_lookup` ADD CONSTRAINT `wp_wc_order_product_lookup_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_order_product_lookup` ADD CONSTRAINT `wp_wc_order_product_lookup_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_order_stats` ADD CONSTRAINT `wp_wc_order_stats_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_wc_order_stats` ADD CONSTRAINT `wp_wc_order_stats_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_woocommerce_order_items` ADD CONSTRAINT `wp_woocommerce_order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_woocommerce_order_itemmeta` ADD CONSTRAINT `wp_woocommerce_order_itemmeta_order_item_id_fkey` FOREIGN KEY (`order_item_id`) REFERENCES `wp_woocommerce_order_items`(`order_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_comments` ADD CONSTRAINT `wp_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_comments` ADD CONSTRAINT `wp_comments_comment_post_ID_fkey` FOREIGN KEY (`comment_post_ID`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wp_commentmeta` ADD CONSTRAINT `wp_commentmeta_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `wp_comments`(`comment_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `summer_specific_category` ADD CONSTRAINT `summer_specific_category_term_taxonomy_id_fkey` FOREIGN KEY (`term_taxonomy_id`) REFERENCES `wp_nepaz2_term_taxonomy`(`term_taxonomy_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_address` ADD CONSTRAINT `user_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_auther_id_fkey` FOREIGN KEY (`auther_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_notifications` ADD CONSTRAINT `user_notifications_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `share_product` ADD CONSTRAINT `share_product_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_notes` ADD CONSTRAINT `order_notes_comment_author_fkey` FOREIGN KEY (`comment_author`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_notes` ADD CONSTRAINT `order_notes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variation` ADD CONSTRAINT `product_variation_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seller_earning` ADD CONSTRAINT `seller_earning_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `wp_posts`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seller_earning` ADD CONSTRAINT `seller_earning_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `wp_nepaz2_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_coupon_codeTowp_nepaz2_term_taxonomy` ADD CONSTRAINT `_coupon_codeTowp_nepaz2_term_taxonomy_A_fkey` FOREIGN KEY (`A`) REFERENCES `coupon_code`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_coupon_codeTowp_nepaz2_term_taxonomy` ADD CONSTRAINT `_coupon_codeTowp_nepaz2_term_taxonomy_B_fkey` FOREIGN KEY (`B`) REFERENCES `wp_nepaz2_term_taxonomy`(`term_taxonomy_id`) ON DELETE CASCADE ON UPDATE CASCADE;
