export interface TeamMember {
  id: string;
  nameKey: string;
  organizationKey: string;
  roleKey?: string;
  bioKey?: string;
  image?: string;
  /** Email for linking to registered user profile */
  email?: string;
  /** Whether this member is part of the core executive board */
  isCoreMember?: boolean;
  /** Role in the executive board (e.g., "Chủ tịch", "Ủy viên", "Thư ký") */
  execRoleKey?: string;
}

// Core executive board members (8 members)
export const coreTeamMembers: TeamMember[] = [
  {
    id: "mai-thanh-phong",
    nameKey: "team.members.maiThanhPhong.name",
    organizationKey: "team.members.maiThanhPhong.organization",
    roleKey: "team.members.maiThanhPhong.role",
    bioKey: "team.members.maiThanhPhong.bio",
    image: "/maithanhphong.jpg",
    isCoreMember: true,
    execRoleKey: "team.members.maiThanhPhong.execRole",
  },
  {
    id: "nguyen-van-vu",
    nameKey: "team.members.nguyenVanVu.name",
    organizationKey: "team.members.nguyenVanVu.organization",
    roleKey: "team.members.nguyenVanVu.role",
    bioKey: "team.members.nguyenVanVu.bio",
    image: "/nguyenvanvu.jpeg",
    email: "nvu@fit.hcmus.edu.vn",
    isCoreMember: true,
    execRoleKey: "team.members.nguyenVanVu.execRole",
  },
  {
    id: "ngo-duc-thanh",
    nameKey: "team.members.ngoDucThanh.name",
    organizationKey: "team.members.ngoDucThanh.organization",
    roleKey: "team.members.ngoDucThanh.role",
    bioKey: "team.members.ngoDucThanh.bio",
    image: "/ngoducthanh.jpeg",
    email: "thanhnd@uit.edu.vn",
    isCoreMember: true,
    execRoleKey: "team.members.ngoDucThanh.execRole",
  },
  {
    id: "le-anh-cuong",
    nameKey: "team.members.leAnhCuong.name",
    organizationKey: "team.members.leAnhCuong.organization",
    roleKey: "team.members.leAnhCuong.role",
    bioKey: "team.members.leAnhCuong.bio",
    image: "/leanhcuong.jpg",
    email: "leanhcuong@tdtu.edu.vn",
    isCoreMember: true,
    execRoleKey: "team.members.leAnhCuong.execRole",
  },
  {
    id: "tran-tuyen-duc",
    nameKey: "team.members.tranTuyenDuc.name",
    organizationKey: "team.members.tranTuyenDuc.organization",
    roleKey: "team.members.tranTuyenDuc.role",
    bioKey: "team.members.tranTuyenDuc.bio",
    image: "/trantuyenduc.jpeg",
    email: "ductt@saobacdau.vn",
    isCoreMember: true,
    execRoleKey: "team.members.tranTuyenDuc.execRole",
  },
  {
    id: "tran-phuc-hong",
    nameKey: "team.members.tranPhucHong.name",
    organizationKey: "team.members.tranPhucHong.organization",
    roleKey: "team.members.tranPhucHong.role",
    bioKey: "team.members.tranPhucHong.bio",
    image: "/hongtran.jpeg",
    email: "tphong@tma.com.vn",
    isCoreMember: true,
    execRoleKey: "team.members.tranPhucHong.execRole",
  },
  {
    id: "thu-vo",
    nameKey: "team.members.thuVo.name",
    organizationKey: "team.members.thuVo.organization",
    roleKey: "team.members.thuVo.role",
    bioKey: "team.members.thuVo.bio",
    image: "/votrongthu.jpeg",
    email: "vo.tr.thu@gmail.com",
    isCoreMember: true,
    execRoleKey: "team.members.thuVo.execRole",
  },
  {
    id: "quan-thanh-tho",
    nameKey: "team.members.quanThanhTho.name",
    organizationKey: "team.members.quanThanhTho.organization",
    roleKey: "team.members.quanThanhTho.role",
    bioKey: "team.members.quanThanhTho.bio",
    image: "/quan-thanh-tho-1650_637175521863222888.jpg",
    email: "qttho@hcmut.edu.vn",
    isCoreMember: true,
    execRoleKey: "team.members.quanThanhTho.execRole",
  },
];

// Extended team members (non-core members)
export const extendedTeamMembers: TeamMember[] = [
  {
    id: "vo-dinh-bay",
    nameKey: "team.members.voDinhBay.name",
    organizationKey: "team.members.voDinhBay.organization",
    roleKey: "team.members.voDinhBay.role",
    bioKey: "team.members.voDinhBay.bio",
    image: "/vodinhbay.jpeg",
    email: "vd.bay@hutech.edu.vn",
  },
  {
    id: "le-xuan-bach",
    nameKey: "team.members.leXuanBach.name",
    organizationKey: "team.members.leXuanBach.organization",
    roleKey: "team.members.leXuanBach.role",
    bioKey: "team.members.leXuanBach.bio",
    image: "/lexuanbach.jpg",
    email: "lexuanbach@hcmut.edu.vn",
  },
  {
    id: "huynh-huu-bang",
    nameKey: "team.members.huynhHuuBang.name",
    organizationKey: "team.members.huynhHuuBang.organization",
    roleKey: "team.members.huynhHuuBang.role",
    bioKey: "team.members.huynhHuuBang.bio",
    image: "/huynhHuuBang.jpg",
    email: "banghh@medical-ai.com.vn",
  },
  {
    id: "le-nhat-duy",
    nameKey: "team.members.leNhatDuy.name",
    organizationKey: "team.members.leNhatDuy.organization",
    roleKey: "team.members.leNhatDuy.role",
    bioKey: "team.members.leNhatDuy.bio",
    image: "/leNhatDuy.jpg",
    email: "duyln@iuh.edu.vn",
  },
  {
    id: "phong-nguyen",
    nameKey: "team.members.phongNguyen.name",
    organizationKey: "team.members.phongNguyen.organization",
    roleKey: "team.members.phongNguyen.role",
    bioKey: "team.members.phongNguyen.bio",
    image: "/phongnguyen.jpeg",
  },
  {
    id: "le-thanh-son",
    nameKey: "team.members.leThanhSon.name",
    organizationKey: "team.members.leThanhSon.organization",
    roleKey: "team.members.leThanhSon.role",
    bioKey: "team.members.leThanhSon.bio",
    image: "/SonLe.jpeg",
    email: "thsonvt@gmail.com",
  },
  {
    id: "hua-phuoc-truong",
    nameKey: "team.members.huaPhuocTruong.name",
    organizationKey: "team.members.huaPhuocTruong.organization",
    roleKey: "team.members.huaPhuocTruong.role",
    bioKey: "team.members.huaPhuocTruong.bio",
    image: "/huaphuoctruong.webp",
    email: "truong.hua@youthdev.net",
  },
];

// Combined list for backward compatibility
export const teamMembers: TeamMember[] = [...coreTeamMembers, ...extendedTeamMembers];
