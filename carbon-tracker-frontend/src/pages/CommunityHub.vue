<template>
  <v-app>
    <!-- ================= MANUAL NAVBAR ================= -->
    <v-app-bar app color="green-darken-2" dark elevation="4">
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-leaf" class="mr-2" />
        <span class="font-weight-bold">EcoTracker</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn 
        to="/"
        variant="text"
        class="mx-1"
        prepend-icon="mdi-home"
      >
        Home
      </v-btn>

      <v-btn 
        to="/community"
        variant="text"
        class="mx-1"
        prepend-icon="mdi-account-group"
      >
        Community
      </v-btn>

      <v-btn 
        to="/calculator"
        variant="text"
        class="mx-1"
        prepend-icon="mdi-calculator"
      >
        Calculator
      </v-btn>

      <v-btn 
        to="/activity"
        variant="text"
        class="mx-1"
        prepend-icon="mdi-run"
      >
        Activities
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <v-list-item-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-logout</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- ================= MAIN CONTENT ================= -->
    <v-main>
      <v-container fluid class="mt-8" style="padding-top: 20px;">
        <v-row>
          <!-- LEFT SIDEBAR -->
          <v-col cols="12" md="3">
            <div class="premium-sidebar">
              <h3 class="sidebar-title">🌿 Explore</h3>
              <v-list dense nav>
                <v-list-item @click="filterPosts('post')" :class="{ active: filterType==='post' }">
                  <v-list-item-icon><v-icon color="green darken-2">mdi-post-outline</v-icon></v-list-item-icon>
                  <v-list-item-title>Posts</v-list-item-title>
                </v-list-item>

                <v-list-item @click="filterPosts('tip')" :class="{ active: filterType==='tip' }">
                  <v-list-item-icon><v-icon color="green darken-2">mdi-lightbulb-on-outline</v-icon></v-list-item-icon>
                  <v-list-item-title>Tips</v-list-item-title>
                </v-list-item>

                <v-list-item @click="filterType = 'events'" :class="{ active: filterType==='events' }">
                  <v-list-item-icon><v-icon color="green darken-2">mdi-calendar-star</v-icon></v-list-item-icon>
                  <v-list-item-title>Events</v-list-item-title>
                </v-list-item>

                <!-- ECOLEADER EVENT CREATION BUTTON (Only for Leaders) -->
                <v-list-item 
                  v-if="userStore.user?.role === 'Leader'" 
                  @click="eventDialog = true"
                  class="event-creator-btn"
                >
                  <v-list-item-icon>
                    <v-icon color="green darken-2">mdi-plus-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Create Event</v-list-item-title>
                </v-list-item>

                <!-- ECOLEADER REQUEST SECTION -->
                <v-list-item 
                  @click="handleEcoLeader" 
                  :class="{ active: ecoLeaderStatus==='pending' || ecoLeaderStatus==='approved' }"
                >
                  <v-list-item-icon><v-icon color="green darken-2">mdi-crown-outline</v-icon></v-list-item-icon>
                  <v-list-item-title>
                    <span v-if="ecoLeaderStatus==='approved'">EcoLeader - Approved ✅</span>
                    <span v-else-if="ecoLeaderStatus==='pending'">EcoLeader Request Pending ⏳</span>
                    <span v-else>Be an EcoLeader</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-col>

          <!-- MAIN FEED -->
          <v-col cols="12" md="9">
            <!-- POSTS & TIPS LIST -->
            <v-row v-if="filterType !== 'events'" dense>
              <v-col cols="12" sm="6" md="6" lg="4" v-for="post in filteredPosts" :key="post._id">
                <v-card
                  class="post-card mb-6 elevation-6"
                  @mouseover="hoverPost=post._id"
                  @mouseleave="hoverPost=null"
                  :style="{ transform: hoverPost===post._id ? 'scale(1.02)' : 'scale(1)' }"
                >
                  <v-img
                    v-if="post.image"
                    :src="`http://localhost:3000${post.image}`"
                    class="post-image"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
                    height="200px"
                  ></v-img>

                  <v-card-text>
                    <div class="d-flex justify-space-between align-center mb-2">
                      <div>
                        <strong>{{ post.username }}</strong>
                        <span class="text-caption text-grey-darken-1">• {{ formatDate(post.createdAt) }}</span>
                      </div>
                      <v-chip
                        small
                        :color="post.type==='tip' ? 'green darken-1' : 'light-green darken-1'"
                        text-color="white"
                      >
                        {{ post.type.toUpperCase() }}
                      </v-chip>
                    </div>

                    <h3 class="text-h6 font-weight-bold mb-2">{{ post.title }}</h3>
                    <p class="text-body-2 mb-2">
                      {{ expandedPosts[post._id] ? post.content : post.content.substring(0, 120) }}
                      <span v-if="post.content.length > 120">
                        <a href="#" @click.prevent="toggleExpand(post._id)">
                          {{ expandedPosts[post._id] ? ' Show less' : ' Read more' }}
                        </a>
                      </span>
                    </p>
                  </v-card-text>

                  <v-card-actions class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-btn icon @click="toggleReaction(post._id, 'like')">
                        <v-icon color="green-darken-1">mdi-thumb-up</v-icon>
                      </v-btn>
                      <span class="me-4">{{ post.reactionCount || 0 }}</span>

                      <v-btn icon @click="openCommentDialog(post)">
                        <v-icon>mdi-comment</v-icon>
                      </v-btn>
                      <span>{{ post.commentCount || 0 }}</span>
                    </div>
                    <v-btn
                      icon
                      v-if="isCurrentUser(post.user)"
                      @click="handleDeletePost(post._id)"
                    >
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- EVENTS SECTION -->
            <v-row v-if="filterType === 'events'" dense>
              <v-col 
                cols="12" 
                sm="6" 
                md="4" 
                v-for="event in events" 
                :key="event._id"
              >
                <v-card class="pa-4 mb-4 elevation-4 event-card">
                  <!-- Event Image -->
                  <v-img
                    v-if="event.image"
                    :src="`http://localhost:3000${event.image}`"
                    height="120px"
                    class="mb-2"
                  ></v-img>
                  
                  <!-- Event Header -->
                  <div class="d-flex justify-space-between align-center mb-2">
                    <v-chip small color="green darken-1" text-color="white">
                      {{ event.category }}
                    </v-chip>
                    <v-chip 
                      small 
                      :color="getEventStatusColor(event.status)" 
                      text-color="white"
                    >
                      {{ event.status }}
                    </v-chip>
                  </div>
                  
                  <!-- Event Content -->
                  <h3 class="text-h6 font-weight-bold mb-2">{{ event.title }}</h3>
                  <p class="text-body-2 mb-2">{{ event.description.substring(0, 100) }}...</p>
                  
                  <!-- Event Details -->
                  <div class="event-details">
                    <div class="d-flex align-center mb-1">
                      <v-icon small class="mr-1">mdi-calendar</v-icon>
                      <span class="text-caption">{{ formatEventDate(event.date) }}</span>
                    </div>
                    <div class="d-flex align-center mb-1">
                      <v-icon small class="mr-1">mdi-clock</v-icon>
                      <span class="text-caption">{{ event.time }}</span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-1">mdi-map-marker</v-icon>
                      <span class="text-caption">{{ event.location }}</span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon small class="mr-1">mdi-account-group</v-icon>
                      <span class="text-caption">Organized by: {{ event.organizer }}</span>
                    </div>
                  </div>

                  <!-- Event Actions -->
                  <v-card-actions>
                    <v-btn 
                      color="green darken-1" 
                      small 
                      @click="viewEventDetails(event)"
                    >
                      View Details
                    </v-btn>
                    
                    <!-- Delete button for event creator -->
                    <v-btn 
                      v-if="isEventCreator(event.createdBy)"
                      icon 
                      small 
                      color="red" 
                      @click="deleteEvent(event._id)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- No Events Message -->
              <v-col v-if="events.length === 0" cols="12">
                <v-card class="pa-8 text-center">
                  <v-icon size="64" color="grey lighten-1">mdi-calendar-blank</v-icon>
                  <h3 class="text-h6 mt-4">No Events Yet</h3>
                  <p class="text-body-1 mt-2">Be the first to create an event!</p>
                  <v-btn 
                    v-if="userStore.user?.role === 'Leader'"
                    color="green darken-1" 
                    class="mt-4"
                    @click="eventDialog = true"
                  >
                    Create First Event
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- FLOATING POST BUTTON (for Posts/Tips) -->
        <v-btn 
          v-if="filterType !== 'events'" 
          fab 
          color="green darken-1" 
          dark 
          class="fab-button" 
          @click="postDialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <!-- CREATE POST/TIP MODAL -->
        <v-dialog v-model="postDialog" max-width="600">
          <v-card class="pa-4">
            <h3 class="text-h6 font-weight-bold mb-3">Share a Post or Tip 📝</h3>
            <v-form @submit.prevent="handleCreatePost">
              <v-text-field v-model="newPost.title" label="Title" outlined required class="mb-3" />
              <v-textarea v-model="newPost.content" label="Content" outlined required rows="4" class="mb-3" />
              <v-select v-model="newPost.type" :items="['post','tip']" label="Type" outlined class="mb-3" />
              <v-file-input v-model="newPost.image" label="Upload an image (optional)" accept="image/*" outlined class="mb-3" />
              <v-card-actions class="justify-end">
                <v-btn text @click="postDialog=false">Cancel</v-btn>
                <v-btn color="green darken-1" type="submit" :loading="loading">Post</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <!-- CREATE EVENT DIALOG -->
        <v-dialog v-model="eventDialog" max-width="600">
          <v-card class="pa-4">
            <h3 class="text-h6 font-weight-bold mb-3">Create New Event 🎯</h3>
            <v-form @submit.prevent="createEvent">
              <v-text-field 
                v-model="newEvent.title" 
                label="Event Title" 
                outlined 
                required 
                class="mb-3" 
              />
              
              <v-textarea 
                v-model="newEvent.description" 
                label="Event Description" 
                outlined 
                required 
                rows="3" 
                class="mb-3" 
              />
              
              <v-row>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newEvent.date" 
                    label="Date" 
                    type="date" 
                    outlined 
                    required 
                    class="mb-3" 
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newEvent.time" 
                    label="Time" 
                    type="time" 
                    outlined 
                    required 
                    class="mb-3" 
                  />
                </v-col>
              </v-row>
              
              <v-text-field 
                v-model="newEvent.location" 
                label="Location" 
                outlined 
                required 
                class="mb-3" 
              />
              
              <v-text-field 
                v-model="newEvent.organizer" 
                label="Organizer Name" 
                outlined 
                required 
                class="mb-3" 
              />
              
              <v-row>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newEvent.contactEmail" 
                    label="Contact Email" 
                    type="email" 
                    outlined 
                    required 
                    class="mb-3" 
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    v-model="newEvent.contactPhone" 
                    label="Contact Phone" 
                    outlined 
                    class="mb-3" 
                  />
                </v-col>
              </v-row>
              
              <v-select 
                v-model="newEvent.category" 
                :items="eventCategories" 
                label="Event Category" 
                outlined 
                required 
                class="mb-3" 
              />
              
              <v-text-field 
                v-model="newEvent.maxParticipants" 
                label="Max Participants (Optional)" 
                type="number" 
                outlined 
                class="mb-3" 
              />
              
              <v-file-input 
                v-model="newEvent.image" 
                label="Event Image (Optional)" 
                accept="image/*" 
                outlined 
                class="mb-3" 
              />
              
              <v-card-actions class="justify-end">
                <v-btn text @click="eventDialog = false">Cancel</v-btn>
                <v-btn 
                  color="green darken-1" 
                  type="submit" 
                  :loading="eventLoading"
                >
                  Create Event
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <!-- EVENT DETAILS DIALOG -->
        <v-dialog v-model="eventDetailDialog" max-width="500">
          <v-card class="pa-4">
            <v-card-title class="text-h5">{{ selectedEvent?.title }}</v-card-title>
            <v-card-text>
              <v-img 
                v-if="selectedEvent?.image" 
                :src="`http://localhost:3000${selectedEvent.image}`" 
                height="200px" 
                class="mb-3"
              ></v-img>
              
              <p><strong>Description:</strong> {{ selectedEvent?.description }}</p>
              <p><strong>Date:</strong> {{ formatEventDate(selectedEvent?.date) }}</p>
              <p><strong>Time:</strong> {{ selectedEvent?.time }}</p>
              <p><strong>Location:</strong> {{ selectedEvent?.location }}</p>
              <p><strong>Organizer:</strong> {{ selectedEvent?.organizer }}</p>
              <p><strong>Contact:</strong> {{ selectedEvent?.contactEmail }}</p>
              <p><strong>Category:</strong> {{ selectedEvent?.category }}</p>
              <p v-if="selectedEvent?.maxParticipants">
                <strong>Max Participants:</strong> {{ selectedEvent.maxParticipants }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green darken-1" @click="eventDetailDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- COMMENT DIALOG -->
        <v-dialog v-model="commentDialog" max-width="500">
          <v-card class="pa-4">
            <h3 class="text-h6 mb-3">Add a Comment</h3>
            <v-textarea v-model="commentText" label="Write your comment" outlined rows="3"></v-textarea>
            <v-card-actions class="justify-end">
              <v-btn text @click="commentDialog = false">Cancel</v-btn>
              <v-btn color="green-darken-1" @click="submitComment" :loading="commentLoading">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '../api';

// Router
const router = useRouter();

// Stores
const userStore = useUserStore();

// STATE - Posts & Tips
const posts = ref([]);
const expandedPosts = ref({});
const newPost = ref({ title: '', content: '', type: 'post', image: null });
const loading = ref(false);
const commentDialog = ref(false);
const commentText = ref('');
const commentPostId = ref(null);
const commentLoading = ref(false);
const postDialog = ref(false);
const hoverPost = ref(null);
const filterType = ref('post'); // default to post view

const currentUserId = ref(localStorage.getItem('userId') || '');
const ecoLeaderStatus = ref(''); // '', 'pending', 'approved'

// STATE - Events
const events = ref([]);
const eventDialog = ref(false);
const eventDetailDialog = ref(false);
const eventLoading = ref(false);
const selectedEvent = ref(null);

const newEvent = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  organizer: '',
  contactEmail: '',
  contactPhone: '',
  category: '',
  maxParticipants: null,
  image: null
});

const eventCategories = [
  "Cleaning Drive",
  "Tree Plantation", 
  "Awareness Camp",
  "Recycling",
  "Wildlife",
  "Other"
];

// NAVBAR FUNCTIONS
const handleLogout = async () => {
  try {
    await api.post('/user/logout');
    localStorage.removeItem('token');
    router.push('/login');
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// ... rest of your existing functions remain exactly the same ...
// FETCH POSTS & TIPS
const fetchPosts = async () => {
  try {
    const res = await api.get('/community/posts');
    posts.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

// FETCH EVENTS
const fetchEvents = async () => {
  try {
    const res = await api.get('/events');
    events.value = res.data;
  } catch (err) {
    console.error('Error fetching events:', err);
  }
};

// FETCH ECOLEADER STATUS
const fetchEcoLeaderStatus = async () => {
  try {
    const res = await api.get('/user/profile', { withCredentials: true });
    ecoLeaderStatus.value = res.data.user.leaderRequestStatus || '';
  } catch (err) {
    console.error('Error fetching EcoLeader status:', err);
  }
};

// FILTER POSTS
const filteredPosts = computed(() => {
  if (filterType.value === 'events') return [];
  return posts.value.filter(p => p.type === filterType.value);
});

const filterPosts = (type) => { 
  filterType.value = type; 
};

// UTIL FUNCTIONS
const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

const isCurrentUser = (userField) => {
  if (!userField || !currentUserId.value) return false;
  return (
    userField === currentUserId.value ||
    userField?._id === currentUserId.value || 
    userField?.toString() === currentUserId.value
  );
};

// POSTS & TIPS FUNCTIONS
const handleCreatePost = async () => {
  if (!newPost.value.title || !newPost.value.content) return;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', newPost.value.title);
    formData.append('content', newPost.value.content);
    formData.append('type', newPost.value.type);
    if (newPost.value.image) formData.append('image', newPost.value.image);

    await api.post('/community/posts', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true 
    });

    newPost.value = { title: '', content: '', type: 'post', image: null };
    fetchPosts();
    postDialog.value = false;
  } catch (err) {
    console.error('Error creating post:', err);
  } finally {
    loading.value = false;
  }
};

const toggleReaction = async (postId, type) => {
  try {
    await api.post(`/community/posts/${postId}/react`, { type }, { withCredentials: true });
    fetchPosts();
  } catch (err) {
    console.error(err);
  }
};

const openCommentDialog = (post) => {
  commentPostId.value = post._id;
  commentText.value = '';
  commentDialog.value = true;
};

const submitComment = async () => {
  if (!commentText.value.trim()) return;
  commentLoading.value = true;
  try {
    await api.post(`/community/posts/${commentPostId.value}/comments`, 
      { text: commentText.value }, 
      { withCredentials: true }
    );
    commentDialog.value = false;
    fetchPosts();
  } catch (err) {
    console.error(err);
  } finally {
    commentLoading.value = false;
  }
};

const handleDeletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    await api.delete(`/community/posts/${postId}`, { withCredentials: true });
    fetchPosts();
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};

const toggleExpand = (postId) => {
  expandedPosts.value[postId] = !expandedPosts.value[postId];
};

// EVENT FUNCTIONS
const createEvent = async () => {
  eventLoading.value = true;
  try {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(newEvent.value).forEach(key => {
      if (newEvent.value[key] !== null && newEvent.value[key] !== '') {
        formData.append(key, newEvent.value[key]);
      }
    });

    await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });

    // Reset form and close dialog
    newEvent.value = {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organizer: '',
      contactEmail: '',
      contactPhone: '',
      category: '',
      maxParticipants: null,
      image: null
    };
    
    eventDialog.value = false;
    fetchEvents(); // Refresh events list
    alert('Event created successfully!');
    
  } catch (err) {
    console.error('Error creating event:', err);
    alert(err.response?.data?.message || 'Failed to create event');
  } finally {
    eventLoading.value = false;
  }
};

const viewEventDetails = (event) => {
  selectedEvent.value = event;
  eventDetailDialog.value = true;
};

const deleteEvent = async (eventId) => {
  if (!confirm("Are you sure you want to delete this event?")) return;
  
  try {
    await api.delete(`/events/${eventId}`, { withCredentials: true });
    fetchEvents(); // Refresh list
    alert('Event deleted successfully!');
  } catch (err) {
    console.error('Error deleting event:', err);
    alert(err.response?.data?.message || 'Failed to delete event');
  }
};

const isEventCreator = (createdBy) => {
  return createdBy?._id === userStore.user?._id || 
         createdBy === userStore.user?._id;
};

const formatEventDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getEventStatusColor = (status) => {
  const colors = {
    upcoming: 'blue',
    ongoing: 'green',
    completed: 'grey',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
};

// ECOLEADER REQUEST
const handleEcoLeader = async () => {
  if (ecoLeaderStatus.value === 'approved') return; // already approved
  if (ecoLeaderStatus.value === 'pending') return; // already requested

  try {
    const res = await api.post('/user/leader/request', {}, { withCredentials: true });
    ecoLeaderStatus.value = 'pending';
    alert(res.data.message || 'Request sent successfully. Await admin approval.');
  } catch (err) {
    console.error('Error requesting EcoLeader:', err);
    alert(err.response?.data?.message || 'Failed to send request.');
  }
};

// MOUNT
onMounted(() => {
  fetchPosts();
  fetchEvents();
  fetchEcoLeaderStatus();
});
</script>

<style scoped>
/* Added padding to account for navbar */
.v-container.fluid {
  padding-top: 80px;
}

.fab-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

/* SIDEBAR */
.premium-sidebar {
  position: sticky;
  top: 100px; /* Adjusted for navbar */
  background: linear-gradient(145deg, #f0fff4, #e6f4ea);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  min-height: 80vh;
  transition: all 0.3s ease;
}

.premium-sidebar:hover {
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.sidebar-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #2e7d32;
  text-align: center;
}

.premium-sidebar .v-list-item {
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.2s;
  cursor: pointer;
}

.premium-sidebar .v-list-item:hover {
  background-color: rgba(46, 125, 50, 0.1);
}

.premium-sidebar .v-list-item.active {
  background-color: #2e7d32;
  color: white;
}

.premium-sidebar .v-list-item.active .v-icon {
  color: white !important;
}

.event-creator-btn {
  background: linear-gradient(145deg, #e8f5e8, #c8e6c9);
  border-radius: 10px;
  margin-top: 10px;
}

/* POST CARD */
.post-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.post-image {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 12px;
}

/* EVENT CARD */
.event-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  height: 100%;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px;
}
</style>