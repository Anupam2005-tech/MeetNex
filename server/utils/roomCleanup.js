const ChatMessage = require("../models/ChatMessage");
const fs = require("fs");
const path = require("path");

const cleanupTimers = new Map();
const CLEANUP_DELAY_MS = 60 * 1000; // 1 minute grace period

// Extract filename from URL (assuming /uploads/filename structure)
const getFilePathFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/uploads/");
  if (parts.length < 2) return null;
  return path.join(__dirname, "../uploads", parts[1]);
};

const performCleanup = async (roomId) => {
  console.log(`🧹 performing cleanup for room: ${roomId}`);
  try {
    // 1. Find all files to delete
    const messages = await ChatMessage.find({ roomId, "attachment.url": { $exists: true } });
    
    for (const msg of messages) {
      if (msg.attachment?.url) {
        const filePath = getFilePathFromUrl(msg.attachment.url);
        if (filePath && fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete file ${filePath}:`, err);
            else console.log(`Deleted file: ${filePath}`);
          });
        }
      }
    }

    // 2. Delete chat history from DB
    await ChatMessage.deleteMany({ roomId });
    console.log(`✅ Cleaned up chat history for room: ${roomId}`);

  } catch (err) {
    console.error(`Cleanup failed for room ${roomId}:`, err);
  } finally {
    cleanupTimers.delete(roomId);
  }
};

const scheduleRoomCleanup = (roomId) => {
  console.log(`⏳ Scheduling cleanup for room: ${roomId} in ${CLEANUP_DELAY_MS}ms`);
  
  if (cleanupTimers.has(roomId)) return; // Already scheduled

  const timer = setTimeout(() => {
    performCleanup(roomId);
  }, CLEANUP_DELAY_MS);

  cleanupTimers.set(roomId, timer);
};

const cancelRoomCleanup = (roomId) => {
  if (cleanupTimers.has(roomId)) {
    console.log(`🛑 Canceling cleanup for room: ${roomId} (User joined)`);
    clearTimeout(cleanupTimers.get(roomId));
    cleanupTimers.delete(roomId);
  }
};

module.exports = { scheduleRoomCleanup, cancelRoomCleanup };
