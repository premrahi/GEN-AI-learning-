import "dotenv/config";
import {createApp} from  "./app.js" ;
import {summarizeService} from "./summarizeService.js" ;

const PORT = process.env.PORT || 4000 ;
const app = createApp(summarizeService()) ;


app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
  console.log(`Node.js ticket summarizer listening on port ${PORT}`);
});