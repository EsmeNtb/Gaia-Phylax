import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { supabase } from "../api/supabaseClient";
import AppNav from "../components/AppNav";

function ReportPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("pollution");
  const [urgency, setUrgency] = useState("medium");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [relatedSpecies, setRelatedSpecies] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by this browser.");
      return;
    }

    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);

        setLatitude(lat);
        setLongitude(lng);
        setMessage("Location added.");
      },
      () => {
        setMessage("Could not get your location. Please allow location access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadReportImage() {
    if (!imageFile) return undefined;

    const extension = imageFile.name.split(".").pop() || "png";
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `reports/${fileName}`;

    const { error } = await supabase.storage
      .from("report-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("report-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    if (!latitude || !longitude) {
      setMessage("Please add your location before sending the report.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setMessage("Location is invalid.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const imageUrl = await uploadReportImage();

      await api.createReport({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        latitude: lat,
        longitude: lng,
        country: country.trim() || undefined,
        city: city.trim() || undefined,
        urgency,
        status: "open",
        image_url: imageUrl,
        related_species: relatedSpecies.trim() || undefined,
      });

      setMessage("Report created successfully 🌿");

      setTimeout(() => {
        navigate("/board");
      }, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header compact">
        <div>
          <p className="eyebrow">Citizen signal</p>
          <h2>New Report</h2>
          <p>Send an environmental alert to the Gaia Phylax board.</p>
        </div>

        <AppNav />
      </header>

      <section className="report-form-card">
        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Plastic waste near canal"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What did you see? Any wildlife affected?"
            />
          </label>

          <div className="photo-upload-field">
        <span className="report-label">Photo</span>

        <label className="photo-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0] || null)
                }
              />

              <span className="photo-upload-icon">📷</span>

              <div>
                <strong>
                  {imageFile ? imageFile.name : "Add a field photo"}
                </strong>

                <small>
                  {imageFile
                    ? "Click to replace the image"
                    : "Upload a photo of the report area"}
                </small>
              </div>
            </label>
          </div>

          {imagePreview && (
            <div className="report-image-preview">
              <img src={imagePreview} alt="Report preview" />
            </div>
          )}

          <div className="form-grid">
            <label>
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="pollution">Pollution</option>
                <option value="fire">Fire / Smoke</option>
                <option value="habitat_damage">Habitat damage</option>
                <option value="injured_animal">Injured animal</option>
                <option value="endangered_species">Endangered species</option>
                <option value="illegal_hunting_fishing">
                  Illegal hunting / fishing
                </option>
                <option value="water_contamination">Water contamination</option>
                <option value="flood">Flood</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Urgency
              <select
                value={urgency}
                onChange={(event) => setUrgency(event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="location-autofill-button"
            onClick={useCurrentLocation}
          >
            📍 Use my current location
          </button>

          {latitude && longitude && (
            <p className="location-confirmation">
              Location added: {latitude}, {longitude}
            </p>
          )}

          <div className="form-grid">
            <label>
              City
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Optional"
              />
            </label>

            <label>
              Country
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="technical-location-fields">
            <div className="form-grid">
              <label>
                Latitude
                <input
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                />
              </label>

              <label>
                Longitude
                <input
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                />
              </label>
            </div>
          </div>

          <label>
            Related species
            <input
              value={relatedSpecies}
              onChange={(event) => setRelatedSpecies(event.target.value)}
              placeholder="Ambystoma mexicanum"
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary-link submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send report 🌱"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ReportPage;