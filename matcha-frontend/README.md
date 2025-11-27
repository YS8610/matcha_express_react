# Frontend features

Need time for manual test, below are just guidelines.

## Registration & Authentication (IV.1)

  - User registration form (email, username, last name, first name, password)
  - Password validation (reject common English words)
  - Email verification link sent after registration
  - Login with username and password
  - Password reset email request
  - Logout button (accessible from any page)

## User Profile (IV.2)

  - Complete profile form on first login with:
    - Gender selection
    - Sexual preferences selection
    - Biography text field
    - Interest tags (reusable, e.g., #vegan, #geek)
    - Photo upload (up to 5 pictures)
    - Designate one picture as profile picture
  - Edit/modify profile information anytime
  - Update last name, first name, email
  - View who visited their profile
  - View who "liked" them
  - Public "fame rating" display
  - GPS location tracking (neighborhood level)
  - Manual GPS location adjustment
  - Fallback location tracking (if user opts out)

## Browsing (IV.3)

  - Suggested profiles list
  - Intelligent matching based on:
    - Proximity (geographical location)
    - Shared interests/tags
    - Fame rating
  - Gender/orientation filtering (heterosexual, bisexual, etc.)
  - Sort by: age, location, fame rating, common tags
  - Filter by: age, location, fame rating, common tags

## Advanced Search (IV.4)

  - Age range filter
  - Fame rating range filter
  - Location filter
  - Interest tags filter
  - Sortable search results
  - Filterable search results

## Profile View (IV.5)

  - View other user's profile (all info except email/password)
  - Profile view is recorded in history
  - "Like" button (only visible if current user has a profile picture)
  - "Unlike" / remove "like" functionality
  - View other user's fame rating
  - See online status indicator
  - See last connection time/date
  - Report fake account button
  - Block user button
  - Visual indicator if profile has "liked" you
  - Visual indicator if already "connected"
  - Disconnect/unlike option for connected profiles

## Chat (IV.6)

  - Real-time chat with connected users
  - Message delivery within 10 seconds max
  - New message indicator (visible from any page)

## Notifications (IV.7)

  - Real-time notification for received "like" (max 10 sec delay)
  - Real-time notification for profile view (max 10 sec delay)
  - Real-time notification for new message (max 10 sec delay)
  - Real-time notification for mutual "like" (max 10 sec delay)
  - Real-time notification when connected user "unlikes" (max 10 sec delay)
  - Unread notification indicator (visible from any page)

## General UX (All sections)

  - Light Dark mode properly managed
  - Mobile-friendly layout on smaller screens
  - Proper form validation with error messages
  - Header, main section, and footer present
  - Compatible with latest Firefox and Chrome
  - No console errors/warnings

## Bonus

1. Interactive Map of Users
  - 90% frontend work, 10% backend work
2. Photo Gallery with Editing
  - 70% frontend, 30% backend
3. Schedule/Organize Real-Life Dates
  - 50% frontend, 50% backend
4. Video/Audio Chat
  - 40% frontend, 60% backend
5. OmniAuth Strategies
  - 30% frontend, 70% backend