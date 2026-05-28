# Implementation Plan: Social & Trust Features

## Overview

This implementation plan breaks down the Social & Trust Features into actionable coding tasks. The features include enhanced customer reviews with photo uploads, Instagram feed integration, social sharing capabilities, trust badges, and live chat support using Socket.io.

The implementation follows a phased approach:
1. **Phase 1**: Enhanced Review System with photo uploads
2. **Phase 2**: Social Features (Instagram, Sharing, Trust Badges)
3. **Phase 3**: Live Chat System with real-time messaging

## Tasks

- [ ] 1. Setup and Dependencies
  - Install required backend packages: socket.io, node-cron, axios, ioredis
  - Install required frontend packages: socket.io-client, @tanstack/react-query, react-dropzone, react-image-lightbox
  - Configure environment variables for Instagram API, Cloudinary, and chat settings
  - _Requirements: 4.1, 4.2_

- [ ] 2. Enhanced Review System - Backend Models and API
  - [ ] 2.1 Create Review model with photo support
    - Define Review schema with rating, comment, photos array, verification fields
    - Add indexes for product, status, user, and helpfulCount
    - Include fields for multi-criteria ratings (fit, quality, value)
    - Add moderation fields (status, adminResponse, isFeatured)
    - _Requirements: 2.1.2 AC-2, 2.1.2 AC-3_
  
  - [ ]* 2.2 Write property test for Review model validation
    - **Property 2: Review Data Validation**
    - **Validates: Requirements 2.1.2 AC-2**
    - Test that reviews with valid required fields (rating 1-5, comment 50-500 chars) are accepted
    - Test that reviews with invalid data are rejected
  
  - [ ] 2.3 Implement review submission API endpoint
    - Create POST /api/reviews/:productId endpoint
    - Validate user authentication and purchase verification
    - Handle photo uploads to Cloudinary with resizing and compression
    - Save review with pending status
    - _Requirements: 2.1.2 AC-1, 2.1.2 AC-2, 2.1.2 AC-3_
  
  - [ ]* 2.4 Write property test for purchase verification
    - **Property 1: Review Submission Authorization**
    - **Validates: Requirements 2.1.2 AC-1**
    - Test that only users with delivered orders can submit reviews
  
  - [ ]* 2.5 Write property test for photo upload constraints
    - **Property 3: Photo Upload Constraints**
    - **Validates: Requirements 2.1.2 AC-3**
    - Test photo size limits (≤5MB), format validation (JPG/PNG/WebP), and count limits (≤5)
  
  - [ ] 2.6 Implement review retrieval API endpoint
    - Create GET /api/reviews/:productId endpoint
    - Add pagination, filtering by rating, and sorting options
    - Calculate and return aggregated statistics (average rating, distribution)
    - _Requirements: 2.1.2 AC-4_
  
  - [ ]* 2.7 Write property test for rating aggregation
    - **Property 4: Review Rating Aggregation Accuracy**
    - **Validates: Requirements 2.1.2 AC-4**
    - Test that average rating equals sum/count and distribution percentages are accurate
  
  - [ ] 2.8 Implement helpful vote and report endpoints
    - Create PUT /api/reviews/:reviewId/helpful endpoint
    - Create POST /api/reviews/:reviewId/report endpoint
    - Track user votes to prevent duplicates
    - _Requirements: 2.1.2 AC-4_

- [ ] 3. Enhanced Review System - Admin Moderation API
  - [ ] 3.1 Implement admin review moderation endpoints
    - Create GET /api/admin/reviews/pending endpoint
    - Create PUT /api/admin/reviews/:reviewId/approve endpoint
    - Create PUT /api/admin/reviews/:reviewId/reject endpoint
    - Create POST /api/admin/reviews/:reviewId/respond endpoint
    - Create DELETE /api/admin/reviews/:reviewId endpoint
    - Add admin role verification middleware
    - _Requirements: 2.1.2 AC-5_
  
  - [ ]* 3.2 Write property test for admin authorization
    - **Property 5: Admin Authorization for Review Actions**
    - **Validates: Requirements 2.1.2 AC-5**
    - Test that only admin users can perform moderation actions
  
  - [ ] 3.3 Implement email notifications for reviews
    - Send email when review is approved
    - Send email when admin responds to review
    - Notify admin of new pending reviews
    - Use existing Brevo email service
    - _Requirements: 2.1.2 AC-6_

- [ ] 4. Enhanced Review System - Frontend Components
  - [ ] 4.1 Create ReviewForm component with photo upload
    - Build form with rating stars, comment textarea, and photo upload
    - Integrate react-dropzone for drag-and-drop photo uploads
    - Show upload progress and preview thumbnails
    - Add multi-criteria ratings (fit, quality, value)
    - Validate form inputs before submission
    - _Requirements: 2.1.2 AC-2, 2.1.2 AC-3_
  
  - [ ] 4.2 Create ReviewList and ReviewCard components
    - Display reviews with star ratings, verified badge, and photos
    - Show reviewer name, date, and helpful count
    - Add helpful vote button and report functionality
    - Display admin responses when present
    - _Requirements: 2.1.2 AC-4_
  
  - [ ] 4.3 Create PhotoGallery component with lightbox
    - Display review photos in grid layout
    - Integrate react-image-lightbox for full-screen viewing
    - Add lazy loading for images
    - _Requirements: 2.1.2 AC-4_
  
  - [ ] 4.4 Create review statistics display component
    - Show average rating with star visualization
    - Display rating distribution bar chart
    - Show total review count and verified purchase count
    - _Requirements: 2.1.2 AC-4_
  
  - [ ] 4.5 Integrate review components into product pages
    - Add ReviewForm to product detail page (for purchasers)
    - Add ReviewList with filtering and sorting
    - Add review statistics summary
    - Connect to Redux store for state management
    - _Requirements: 2.1.2 AC-1, 2.1.2 AC-4_

- [ ] 5. Enhanced Review System - Admin Dashboard
  - [ ] 5.1 Create admin review moderation dashboard
    - Build pending reviews list with pagination
    - Add approve/reject action buttons
    - Add admin response form
    - Show review details with customer info
    - _Requirements: 2.1.2 AC-5_
  
  - [ ]* 5.2 Write integration tests for review submission flow
    - Test end-to-end review submission with photo upload
    - Test review approval flow with email notification
    - Test review display with pagination and filtering

- [ ] 6. Checkpoint - Review System Complete
  - Ensure all review tests pass
  - Verify photo uploads work correctly
  - Test admin moderation workflow
  - Ask the user if questions arise

- [ ] 7. Instagram Feed Integration - Backend
  - [ ] 7.1 Create Instagram models
    - Create InstagramPost model with media URL, caption, engagement stats
    - Create InstagramConfig model for access token and settings
    - Add indexes for timestamp and display order
    - _Requirements: 2.2.2 AC-7, 2.2.2 AC-9_
  
  - [ ] 7.2 Implement Instagram API integration service
    - Create service to fetch posts from Instagram Basic Display API
    - Handle OAuth flow for account connection
    - Implement token refresh logic
    - Add error handling for rate limits and API failures
    - _Requirements: 2.2.2 AC-9, 2.2.2 AC-10_
  
  - [ ]* 7.3 Write property test for Instagram cache validity
    - **Property 6: Instagram Cache Validity**
    - **Validates: Requirements 2.2.2 AC-9**
    - Test that cached posts are considered valid within sync interval
  
  - [ ] 7.4 Implement Instagram sync cron job
    - Create cron job to sync posts every 6 hours
    - Track API rate limits and handle gracefully
    - Store posts in database with caching
    - _Requirements: 2.2.2 AC-9_
  
  - [ ] 7.5 Create Instagram API endpoints
    - Create GET /api/instagram/feed endpoint (returns cached posts)
    - Create POST /api/admin/instagram/sync endpoint (manual sync)
    - Create POST /api/admin/instagram/connect endpoint (OAuth)
    - Create GET /api/admin/instagram/status endpoint
    - _Requirements: 2.2.2 AC-9, 2.2.2 AC-10_

- [ ] 8. Instagram Feed Integration - Frontend
  - [ ] 8.1 Create InstagramFeed component
    - Display posts in responsive grid (2 cols mobile, 4 cols desktop)
    - Show post images with hover effects
    - Add "Follow us on Instagram" CTA button
    - Handle loading and error states
    - _Requirements: 2.2.2 AC-7, 2.2.2 AC-8_
  
  - [ ] 8.2 Create InstagramPost component
    - Display post image with caption preview
    - Show like count and engagement stats on hover
    - Link to Instagram post permalink
    - _Requirements: 2.2.2 AC-8_
  
  - [ ] 8.3 Integrate Instagram feed into homepage
    - Add InstagramFeed component to homepage
    - Fetch posts using React Query for caching
    - Add lazy loading for performance
    - _Requirements: 2.2.2 AC-7_
  
  - [ ] 8.4 Create admin Instagram configuration UI
    - Build OAuth connection flow
    - Add manual sync button
    - Display sync status and last sync time
    - Add settings for posts count and sync interval
    - _Requirements: 2.2.2 AC-10_
  
  - [ ]* 8.5 Write integration tests for Instagram sync
    - Test Instagram API integration with mocked responses
    - Test cron job execution
    - Test error handling and fallback to cached posts

- [ ] 9. Social Sharing - Backend
  - [ ] 9.1 Create ShareAnalytics model
    - Define schema with product, user, platform, and tracking fields
    - Add indexes for product, platform, and createdAt
    - Include UTM parameters and conversion tracking
    - _Requirements: 2.3.2 AC-11, 2.3.2 AC-13_
  
  - [ ] 9.2 Implement share tracking API endpoint
    - Create POST /api/share/track endpoint
    - Record share events with platform and product info
    - Track UTM parameters for attribution
    - _Requirements: 2.3.2 AC-13_
  
  - [ ] 9.3 Implement share analytics API endpoint
    - Create GET /api/admin/analytics/shares endpoint
    - Aggregate shares by platform, product, and time period
    - Calculate conversion rates from shared links
    - _Requirements: 2.3.2 AC-13_
  
  - [ ]* 9.4 Write property test for share URL tracking
    - **Property 7: Share URL Tracking Parameters**
    - **Validates: Requirements 2.3.2 AC-11**
    - Test that all share URLs contain required UTM parameters
  
  - [ ]* 9.5 Write property test for share analytics aggregation
    - **Property 8: Share Analytics Aggregation**
    - **Validates: Requirements 2.3.2 AC-13**
    - Test that aggregated counts equal sum of individual events

- [ ] 10. Social Sharing - Frontend
  - [ ] 10.1 Create ShareButtons component
    - Build buttons for WhatsApp, Facebook, Twitter, Copy Link
    - Generate share URLs with UTM tracking parameters
    - Add Open Graph meta tags to product pages
    - Track share clicks via API
    - _Requirements: 2.3.2 AC-11, 2.3.2 AC-12_
  
  - [ ]* 10.2 Write property test for WhatsApp message format
    - **Property 9: WhatsApp Share Message Format**
    - **Validates: Requirements 2.3.2 AC-14**
    - Test that WhatsApp messages contain product name, price, and link
  
  - [ ] 10.3 Create ShareModal component
    - Build modal with share options and preview
    - Show shareable link with copy button
    - Display share success message
    - _Requirements: 2.3.2 AC-12_
  
  - [ ] 10.4 Integrate share buttons into product pages
    - Add ShareButtons to product detail page
    - Add share functionality to product cards
    - Add share to wishlist and order success pages
    - _Requirements: 2.3.2 AC-12_
  
  - [ ] 10.5 Create admin share analytics dashboard
    - Display total shares by platform
    - Show top shared products
    - Display conversion rates from shared links
    - Add date range filtering
    - _Requirements: 2.3.2 AC-13_
  
  - [ ]* 10.6 Write integration tests for share tracking
    - Test share URL generation with UTM parameters
    - Test share tracking API integration
    - Test Open Graph meta tags rendering

- [ ] 11. Trust Badges - Frontend
  - [ ] 11.1 Create TrustBadges component
    - Build badges for Secure Payment, Free Shipping, Easy Returns, COD, Authentic, Support
    - Add icons and short text for each badge
    - Implement hover tooltips with more details
    - Make responsive for mobile
    - _Requirements: 2.4.2 AC-15, 2.4.2 AC-17_
  
  - [ ] 11.2 Create policy pages
    - Create Shipping Policy page
    - Create Return & Refund Policy page
    - Create Privacy Policy page
    - Create Terms & Conditions page
    - Add About Us page with brand story
    - _Requirements: 2.4.2 AC-18_
  
  - [ ] 11.3 Integrate trust badges into key pages
    - Add TrustBadges to homepage hero section
    - Add badges to product detail page near Add to Cart
    - Add badges to checkout page payment section
    - Add badges to footer
    - _Requirements: 2.4.2 AC-16_

- [ ] 12. Checkpoint - Social Features Complete
  - Ensure Instagram feed displays correctly
  - Verify share tracking works across platforms
  - Test trust badges on all key pages
  - Ask the user if questions arise

- [ ] 13. Live Chat System - Backend Models and Socket.io Setup
  - [ ] 13.1 Create chat models
    - Create ChatSession model with customer info, status, and metrics
    - Create ChatMessage model with sender, message, and delivery status
    - Create CannedResponse model for quick replies
    - Add indexes for session lookup and message ordering
    - _Requirements: 2.5.2 AC-19, 2.5.2 AC-20, 2.5.2 AC-22_
  
  - [ ] 13.2 Setup Socket.io server
    - Initialize Socket.io server with Express
    - Configure CORS for frontend domain
    - Add authentication middleware for Socket.io
    - Setup connection and disconnection handlers
    - _Requirements: 2.5.2 AC-20_
  
  - [ ] 13.3 Implement chat session management
    - Create service to manage chat sessions (create, assign, end)
    - Implement queue system for waiting customers
    - Add session state transitions (queued → active → ended)
    - Track wait time and duration metrics
    - _Requirements: 2.5.2 AC-19, 2.5.2 AC-22_

- [ ] 14. Live Chat System - Backend Socket.io Events
  - [ ] 14.1 Implement customer-side Socket.io events
    - Handle join_chat event (create/resume session)
    - Handle send_message event (save and broadcast message)
    - Handle typing event (broadcast typing indicator)
    - Handle read_message event (update message status)
    - Handle upload_file event (handle image/file uploads)
    - _Requirements: 2.5.2 AC-20_
  
  - [ ]* 14.2 Write property test for message ordering
    - **Property 10: Chat Message Ordering**
    - **Validates: Requirements 2.5.2 AC-20**
    - Test that messages are delivered in timestamp order
  
  - [ ] 14.2 Implement agent-side Socket.io events
    - Handle agent_join event (assign agent to session)
    - Handle agent_message event (send message as agent)
    - Handle agent_typing event (broadcast typing to customer)
    - Handle end_chat event (close session)
    - Handle transfer_chat event (reassign to another agent)
    - _Requirements: 2.5.2 AC-22_
  
  - [ ] 14.3 Implement offline mode handling
    - Detect when no agents are online
    - Store offline messages in database
    - Send email notification to admin
    - Auto-reply with expected response time
    - _Requirements: 2.5.2 AC-23_
  
  - [ ]* 14.4 Write property test for offline message storage
    - **Property 12: Offline Message Storage**
    - **Validates: Requirements 2.5.2 AC-23**
    - Test that offline messages are stored and admin is notified

- [ ] 15. Live Chat System - Backend REST API
  - [ ] 15.1 Create chat REST API endpoints
    - Create POST /api/chat/session endpoint (create new session)
    - Create GET /api/chat/history/:sessionId endpoint
    - Create POST /api/chat/transcript endpoint (email transcript)
    - _Requirements: 2.5.2 AC-21, 2.5.2 AC-24_
  
  - [ ]* 15.2 Write property test for pre-chat form validation
    - **Property 11: Pre-Chat Form Validation**
    - **Validates: Requirements 2.5.2 AC-21**
    - Test that form requires name and valid email
  
  - [ ] 15.3 Create admin chat API endpoints
    - Create GET /api/admin/chat/active endpoint (list active chats)
    - Create PUT /api/admin/chat/:sessionId/assign endpoint
    - Create GET /api/admin/chat/analytics endpoint
    - _Requirements: 2.5.2 AC-22, 2.5.2 AC-25_
  
  - [ ]* 15.4 Write property test for chat analytics
    - **Property 13: Chat Analytics Calculation Accuracy**
    - **Validates: Requirements 2.5.2 AC-25**
    - Test that average response time and message counts are accurate
  
  - [ ] 15.5 Implement email transcript functionality
    - Generate HTML email with chat transcript
    - Send via Brevo email service
    - Include customer info and chat metadata
    - _Requirements: 2.5.2 AC-24_
  
  - [ ] 15.6 Implement canned responses management
    - Create CRUD endpoints for canned responses
    - Add shortcut-based retrieval
    - Track usage count for analytics
    - _Requirements: 2.5.2 AC-22_

- [ ] 16. Live Chat System - Frontend Chat Widget
  - [ ] 16.1 Create ChatWidget component
    - Build floating chat button (bottom right)
    - Add minimize/maximize functionality
    - Show unread message indicator
    - Make mobile-responsive
    - _Requirements: 2.5.2 AC-19_
  
  - [ ] 16.2 Create PreChatForm component
    - Build form with name, email, order number, category, message fields
    - Validate required fields
    - Submit to create chat session
    - _Requirements: 2.5.2 AC-21_
  
  - [ ] 16.3 Create ChatWindow component
    - Display chat messages with sender identification
    - Show typing indicators
    - Add message input with send button
    - Display read receipts
    - Show online/offline status
    - _Requirements: 2.5.2 AC-20_
  
  - [ ] 16.4 Integrate Socket.io client
    - Connect to Socket.io server on chat open
    - Handle connection, disconnection, and reconnection
    - Emit and listen to chat events
    - Store messages locally until delivered
    - _Requirements: 2.5.2 AC-20_
  
  - [ ] 16.5 Add file upload to chat
    - Integrate file picker for images/documents
    - Show upload progress
    - Display uploaded files in chat
    - _Requirements: 2.5.2 AC-20_
  
  - [ ] 16.6 Implement offline mode UI
    - Show "We're offline" message when no agents available
    - Display offline form to collect email and message
    - Show expected response time
    - _Requirements: 2.5.2 AC-23_

- [ ] 17. Live Chat System - Frontend Admin Dashboard
  - [ ] 17.1 Create AdminChatDashboard component
    - Display list of active chats
    - Show queue of waiting customers
    - Display chat metrics (wait time, active chats count)
    - Add filters and search
    - _Requirements: 2.5.2 AC-22_
  
  - [ ] 17.2 Create ChatConversation component
    - Display full chat conversation
    - Show customer info sidebar (name, email, orders, cart)
    - Add message input for agent responses
    - Display typing indicators
    - _Requirements: 2.5.2 AC-22_
  
  - [ ] 17.3 Implement canned responses UI
    - Display list of canned responses
    - Add shortcut-based insertion
    - Show preview on hover
    - Add search/filter functionality
    - _Requirements: 2.5.2 AC-22_
  
  - [ ] 17.4 Add chat assignment and transfer functionality
    - Allow agents to assign chats to themselves
    - Add transfer chat to another agent
    - Show agent availability status
    - _Requirements: 2.5.2 AC-22_
  
  - [ ] 17.5 Create chat analytics dashboard
    - Display average response time
    - Show customer satisfaction ratings
    - Display chat volume by hour/day
    - Show agent performance metrics
    - Add date range filtering
    - _Requirements: 2.5.2 AC-25_
  
  - [ ]* 17.6 Write integration tests for chat system
    - Test WebSocket connection and message delivery
    - Test session management and persistence
    - Test email transcript delivery
    - Test offline mode functionality

- [ ] 18. Live Chat System - Notifications and Polish
  - [ ] 18.1 Implement browser notifications
    - Request notification permission
    - Send browser notification for new messages
    - Add sound alert (optional, user-configurable)
    - _Requirements: 2.5.2 AC-24_
  
  - [ ] 18.2 Add chat history persistence
    - Store chat history for 30 days
    - Allow customers to view past chats
    - Implement chat history search
    - _Requirements: 2.5.2 AC-20_
  
  - [ ] 18.3 Implement customer satisfaction rating
    - Show rating prompt after chat ends
    - Collect 1-5 star rating and optional feedback
    - Store ratings for analytics
    - _Requirements: 2.5.2 AC-25_

- [ ] 19. Checkpoint - Chat System Complete
  - Ensure WebSocket connections work reliably
  - Test chat flow from customer and agent perspectives
  - Verify offline mode and email transcripts
  - Test on multiple browsers and devices
  - Ask the user if questions arise

- [ ] 20. Performance Optimization and Caching
  - [ ] 20.1 Implement database indexes
    - Create indexes for Review model (product, status, user, helpfulCount)
    - Create indexes for InstagramPost model (timestamp, isActive)
    - Create indexes for ChatSession model (status, assignedAgent)
    - Create indexes for ShareAnalytics model (product, platform, createdAt)
    - _Requirements: 3.1, 3.3_
  
  - [ ] 20.2 Implement caching strategy
    - Cache product review statistics (invalidate on new review)
    - Cache Instagram posts for 6 hours
    - Cache trust badge content
    - Use Redis for session storage (optional)
    - _Requirements: 3.1, 3.3_
  
  - [ ] 20.3 Optimize image loading
    - Implement lazy loading for review photos
    - Use Cloudinary transformations for responsive images
    - Generate thumbnails for photo galleries
    - Lazy load Instagram feed
    - _Requirements: 3.1, 3.5_
  
  - [ ] 20.4 Implement frontend code splitting
    - Lazy load chat widget component
    - Lazy load Instagram feed component
    - Lazy load review photo gallery
    - Split vendor bundles
    - _Requirements: 3.1_

- [ ] 21. Background Jobs and Cron Tasks
  - [ ] 21.1 Setup cron jobs
    - Instagram sync every 6 hours
    - Review statistics aggregation daily
    - Share analytics aggregation daily
    - Chat analytics aggregation hourly
    - Cleanup old chat sessions weekly
    - _Requirements: 2.2.2 AC-9_
  
  - [ ] 21.2 Implement job queue for async tasks
    - Queue email notifications
    - Queue photo uploads processing
    - Implement retry logic with exponential backoff
    - _Requirements: 3.1_

- [ ] 22. Security and Rate Limiting
  - [ ] 22.1 Implement rate limiting
    - Rate limit review submissions (1 per product per user, 5 per hour)
    - Rate limit chat sessions (5 per hour per IP)
    - Rate limit share tracking (1000 per hour per IP)
    - Respect Instagram API rate limits
    - _Requirements: 3.2_
  
  - [ ] 22.2 Add input validation and sanitization
    - Sanitize review comments to prevent XSS
    - Validate photo MIME types and sizes
    - Sanitize chat messages
    - Validate share URLs
    - _Requirements: 3.2_
  
  - [ ] 22.3 Implement content moderation
    - Add review moderation queue (pending approval)
    - Add report mechanism for inappropriate content
    - Add profanity filter (optional)
    - _Requirements: 3.2_
  
  - [ ] 22.4 Secure sensitive data
    - Encrypt Instagram access tokens at rest
    - Use HTTPS for all API requests
    - Use WSS for WebSocket connections
    - Implement CORS for frontend domain only
    - _Requirements: 3.2_

- [ ] 23. Monitoring and Analytics
  - [ ] 23.1 Add health check endpoints
    - Create /api/health endpoint
    - Check database connection
    - Check Instagram API connection
    - Check Socket.io server status
    - _Requirements: 3.3_
  
  - [ ] 23.2 Implement error logging and monitoring
    - Log API errors with context
    - Log Instagram sync failures
    - Log chat system errors
    - Log photo upload failures
    - _Requirements: 3.3_
  
  - [ ] 23.3 Add performance metrics tracking
    - Track API response times
    - Track chat message latency
    - Track photo upload times
    - Track WebSocket connection count
    - _Requirements: 3.1_

- [ ] 24. Documentation and Deployment
  - [ ] 24.1 Update API documentation
    - Document all new API endpoints
    - Add request/response examples
    - Document Socket.io events
    - Add error codes and messages
  
  - [ ] 24.2 Create admin user guide
    - Document review moderation workflow
    - Document Instagram connection setup
    - Document chat dashboard usage
    - Document analytics interpretation
  
  - [ ] 24.3 Update environment variables documentation
    - Document Instagram API credentials
    - Document chat configuration options
    - Document feature flags
    - Update .env.example files
  
  - [ ] 24.4 Create deployment checklist
    - Database migrations and indexes
    - Environment variables setup
    - Cron jobs configuration
    - Health check verification
    - Performance testing results

- [ ] 25. Final Checkpoint - Complete System Testing
  - Run full test suite (unit, property, integration, E2E)
  - Perform load testing for chat system (100+ concurrent sessions)
  - Test all features on staging environment
  - Verify email notifications work correctly
  - Test on multiple browsers and devices
  - Review security checklist
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties from the design document
- Integration tests validate end-to-end flows with external services
- The implementation follows a phased approach: Reviews → Social Features → Chat System
- Socket.io requires WebSocket support; ensure hosting environment supports it
- Instagram API requires OAuth setup and app approval from Meta
- Cloudinary free tier should be sufficient for initial launch (25GB storage, 25GB bandwidth)
