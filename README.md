# Student Council Election 2083

Shree Baljyoti Secondary School
Hetauda-5, Makawanpur, Nepal

A complete electronic voting system for school elections.

## Features

- **Simple Voting Interface**: Easy-to-use 5-step voting process suitable for students of all ages
- **Real-time Results**: Live dashboard that auto-refreshes every 10 seconds
- **Admin Control**: Start, stop, reset elections and export results
- **Multi-device Support**: Works across multiple voting laptops simultaneously
- **Touch-friendly**: Optimized for both mouse and touchscreen input
- **Reliable**: No partial votes - complete ballots only
- **Professional Design**: Clean, modern blue and white theme

## System Requirements

- 5 voting laptops
- 1 Smart TV for live results
- Internet connection for database access
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Database

The system uses Neon PostgreSQL. Set your `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database
```

### 3. Initialize Database

Run the database initialization script:

```bash
# Connect to your PostgreSQL database and run:
psql -f db/init-election.sql
```

Or use Drizzle:

```bash
pnpm run db:push
```

### 4. Add Images

Place all election images in the `public/images/` folder:

- School logo: `school-logo.png`
- Symbol images: `Book.PNG`, `Sunglass.PNG`, etc. (see `public/images/README.md`)
- Candidate photos: `Book1.JPG`, `Sunglass1.JPG`, etc. (see `public/images/README.md`)

### 5. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### For Teachers (Voting Laptops)

1. **Login**: Use password `vote2083` to access voting interface
2. **Session**: Login once - session remains active for several hours
3. **Voting Process**: Students vote through 5 simple steps:
   - Step 1: Select Head Boy (by symbol only)
   - Step 2: Select Head Girl (by symbol only)
   - Step 3: Select House
   - Step 4: Select House Captain (by symbol only)
   - Step 5: Confirmation screen
4. **Auto-reset**: System automatically prepares for next student after 3 seconds

### For Administrators

1. **Login**: Use password `admin2083` to access admin dashboard
2. **Start Election**: Click "Start Election" to begin voting
3. **Monitor**: View live results at `/results` on Smart TV
4. **Stop Election**: Click "Stop Election" when voting is complete
5. **Export Results**: Download CSV file with all vote details
6. **Reset**: Use "Reset Election" to clear all data for future elections

### For Students

1. Approach voting laptop
2. Follow simple on-screen instructions
3. Select symbols for each position
4. Submit vote
5. See confirmation screen

## Pages

- **/**: Home page with school logo and two main buttons
- **/vote**: 5-step voting interface
- **/admin**: Login page for teachers and administrators
- **/admin/dashboard**: Admin control panel
- **/results**: Live results dashboard (auto-refreshes every 10 seconds)

## API Endpoints

- **GET /api/election/state**: Get current election status
- **POST /api/election/start**: Start the election
- **POST /api/election/stop**: Stop the election
- **POST /api/election/reset**: Reset all election data
- **POST /api/election/vote**: Submit a complete vote
- **GET /api/election/results**: Get current vote counts
- **GET /api/election/export**: Export results as CSV

## Security

- Two separate passwords for voting and admin access
- Session-based authentication
- No partial votes stored
- Complete ballots only
- Confirmation dialogs for critical admin actions

## Deployment

### Build for Production

```bash
pnpm build
```

### Run Production Server

```bash
pnpm start
```

The application runs as a self-contained Node server.

## Tech Stack

- **Framework**: TanStack Start (React)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Routing**: TanStack Router
- **Type Safety**: TypeScript

## Candidates

### Head Boys
- Sugam Gomja (Book)
- Saugat Shrestha (Sunglass)
- Prince Bajagain (Duster)
- Aaditya Chimariya (Chair)

### Head Girls
- Anshu Pokhrel (Belt)
- Krinsha Mainali (Table)
- Arpita Pokhrel (Marker)
- Srijana Thing (Fan)

### House Captains

**Blue House**
- Ajay Ghimire (Key)
- Sadikshya Mainali (Stapler)
- Ayusha Ghimire (Tap)
- Punam Adhikari (House)

**Yellow House**
- Archand Thada Magar (Bicycle)
- Roshan Bishwokarma (Flower)
- Subodh Khanal (Bulb)
- Puspa Ale Magar (Monitor)

**Red House**
- Aaditya Lakai (Tie)
- Swornima Pokhrel (Geometry Box)
- Mandip Magar (Mouse)
- Ujjwal Poudel (Umbrella)

**Green House**
- Rubus Parajuli (Keyboard)
- Santosh Gole (Bottle)
- Nancy Neupane (Watch)
- Priyanka Chaudhary (Speaker)

## Troubleshooting

### Images not displaying
- Ensure all images are in `public/images/` folder
- Check file names match exactly (case-sensitive)
- Verify image formats (PNG, JPG)

### Database connection errors
- Check `DATABASE_URL` in `.env.local`
- Ensure database is running
- Verify network connectivity

### Voting not working
- Ensure election is started from admin dashboard
- Check that election status is "ACTIVE"
- Verify database connection

### Results not updating
- Check that election is active
- Verify database connection
- Wait for auto-refresh (10 seconds)

## Support

For issues or questions, contact the school administration.

## License

This system is proprietary to Shree Baljyoti Secondary School.
