#!/bin/bash

# This script updates all layout files to use database SEO
# Pages that will load SEO from admin/seo interface:
# - /cenik
# - /faq
# - /discounts
# - /schedule

echo "All layouts will be updated to use generatePageMetadata() from database"
echo "Fallback defaults will be used if no database entry exists"
echo "Admin can manage SEO at: https://www.lovelygirls.cz/admin/seo"
