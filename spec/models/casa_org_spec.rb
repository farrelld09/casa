require "rails_helper"

RSpec.describe CasaOrg, type: :model do
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to have_many(:users).dependent(:destroy) }
  it { is_expected.to have_many(:casa_cases).dependent(:destroy) }
  it { is_expected.to have_many(:contact_type_groups).dependent(:destroy) }
  it { is_expected.to have_many(:hearing_types).dependent(:destroy) }
  it { is_expected.to have_many(:mileage_rates).dependent(:destroy) }
  it { is_expected.to have_many(:case_assignments).through(:users) }
  it { is_expected.to have_one_attached(:logo) }
  it { is_expected.to have_one_attached(:court_report_template) }

  it "has unique name" do
    org = create(:casa_org)
    new_org = build(:casa_org, name: org.name)
    expect(new_org.valid?).to be false
  end

  describe "Attachment" do
    it "is valid" do
      aggregate_failures do
        expect(subject.org_logo).to eq(Pathname.new("#{Rails.root}/public/logo.jpeg"))
        subject.logo.attach(
          io: File.open("#{Rails.root}/spec/fixtures/company_logo.png"),
          filename: "company_logo.png", content_type: "image/png"
        )
        expect(subject.logo).to be_an_instance_of(ActiveStorage::Attached::One)
        expect(subject.org_logo).to eq("/rails/active_storage/blobs/redirect/#{subject.logo.signed_id}/#{subject.logo.filename}")
      end
    end
  end

  context "when creating an organization" do
    let(:org) { create(:casa_org, name: "Prince George CASA") }
    it "has a slug based on the name" do
      expect(org.slug).to eq "prince-george-casa"
    end
  end

  describe "user_count" do
    let(:org) { create(:casa_org) }
    subject(:count) { org.user_count }
    before do
      2.times { create(:user, casa_org: org) }
    end
    it { is_expected.to eq 2 }
  end

  describe "case_contacts_count" do
    let(:org) { create(:casa_org) }
    subject(:count) { org.case_contacts_count }
    before do
      5.times do
        casa_case = create(:casa_case, casa_org: org)
        3.times { create(:case_contact, casa_case: casa_case) }
      end
    end
    it { is_expected.to eq 15 }
  end

  describe "generate_contact_types_and_hearing_types" do
    let(:org) { create(:casa_org) }

    before { org.generate_contact_types_and_hearing_types }

    describe "generates default contact type groups" do
      let(:groups) { ContactTypeGroup.where(casa_org: org).joins(:contact_types).pluck(:name, "contact_types.name") }
      let(:groups_hash) { groups.group_by(&:first).map { |k, a| [k, a.map(&:last)] }.to_h }

      it "matches default contact type groups" do
        expect(groups_hash).to match_array(ContactTypeGroup::DEFAULT_CONTACT_TYPE_GROUPS.stringify_keys)
      end
    end

    describe "generates default hearing types" do
      let(:hearing_types_names) { HearingType.where(casa_org: org).pluck(:name) }

      it "matches default hearing types" do
        expect(hearing_types_names).to include(*HearingType::DEFAULT_HEARING_TYPES)
      end
    end
  end
end
